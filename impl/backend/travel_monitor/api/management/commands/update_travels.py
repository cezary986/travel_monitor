from django.core.management.base import BaseCommand, CommandError
import json
import datetime
from api.models import Travel, Offer, Price
from travel_monitor.data_providers import DATA_PROVIDERS
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from travel_monitor.settings import DEAMON_LOGIN, DEAMON_PASSWORD, PORT
import asyncio
import websockets
import requests
from api.serializers import OfferSerializer
from django.utils.timezone import make_aware

"""
Send message to API socket which propagates it to users
"""
async def send_notification_to_socker(offers_that_changed, token):
    async with websockets.connect(
        'ws://localhost:' + str(PORT) + '/ws/offers', 
        extra_headers = [('Cookie', 'sessionid=' + token)]) as websocket:
        serializer = OfferSerializer(offers_that_changed, many=True)
        message = json.dumps({
            'timestamp': datetime.datetime.now().isoformat(),
            'updated': serializer.data,
        })
        await websocket.send(message)

def scrapOffer(offer, notify): 
    has_changed = False
    for data_provider_name in DATA_PROVIDERS:
        if (data_provider_name == offer.data_provider):
            # obtain webscrapper instance for data provider website
            scrapper = DATA_PROVIDERS[data_provider_name]['scrapper_instance']
            has_changed = False
            offer.error = None
            print(offer.url)
            try:
                new_offer_data = scrapper.scrap([offer.url])[0]
            except Exception as e:
                print('Failed to update offer with error:')
                print(str(e))
                offer.error = 'Failed to update offer'
                has_changed = True
            if offer.error == None:
                if offer.current_price == None or new_offer_data.price != offer.current_price.value:
                    has_changed = True
                    last_price = offer.current_price
                new_price = Price(value=new_offer_data.price, offer=offer)
                new_price.save()
                offer.current_price = new_price
                if last_price != None:
                    offer.last_price = last_price
                offer.title = new_offer_data.title
                offer.photo_url = new_offer_data.photo_url
                offer.date_from = make_aware(new_offer_data.date_from).isoformat()
                offer.date_to = make_aware(new_offer_data.date_to).isoformat()
                offer.error = None
            offer.save()
            if has_changed or notify:
                send_notification(offers_changed=[offer])
            return has_changed

"""
Login and obtain token with special deamon user credentials
    returns: auth token
"""
def login_as_user():
    r = requests.post('http://localhost:' + str(PORT) + '/api/auth/login',  json={
        'username': DEAMON_LOGIN,
        'password': DEAMON_PASSWORD
    })

    if r.status_code != 200:
        raise Exception('FATAL ERROR! Authorization for webscraper deamon failer. Did you forget to call "python manage.py setup?"')
    else:
        set_cookie = r.headers['Set-Cookie']
        token = set_cookie[set_cookie.find('=') + 1: set_cookie.find(';')]
        return token

def logout():
    r = requests.post('http://localhost:' + str(PORT) + '/api/auth/logout')

def send_notification(offers_changed):
        token = login_as_user()
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(send_notification_to_socker(offers_changed, token))
        logout()

class Command(BaseCommand):
    help = 'Webscrap all travel offers, saves data to db and send notification via sockets'

    def handle(self, *args, **kwargs):
        travels = Travel.objects.all()
        offers_changed = []
        now = datetime.datetime.now()
        for travel in travels:
            # check only travel offers that haven't started
            for offer in travel.offer_set.all().filter(date_from__gt=now):
                try:
                  has_changed = scrapOffer(offer, notify=True)
                except Exception:
                  continue
                if (has_changed):
                    offers_changed.append(offer)
        self.stdout.write(datetime.datetime.now().isoformat() + ' Travels data scapper and updated!') 
        send_notification(offers_changed=offers_changed)
