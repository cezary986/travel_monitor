from django.core.management.base import BaseCommand, CommandError
import json
import datetime
from api.models import Travel, Offer, Price
from travel_monitor.data_providers import DATA_PROVIDERS
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from travel_monitor.settings import DEAMON_AUTH_CODE
import asyncio
import websockets

"""
Send message to API socket which propagates it to users
"""
async def send_notification_to_socker(message):
    async with websockets.connect('ws://localhost:8080/ws/offer/') as websocket:
        message = json.dumps({
            'message': message,
            'auth': DEAMON_AUTH_CODE # special code to identify deamon process
        })
        await websocket.send(message)


class Command(BaseCommand):
    help = 'Webscrap all travel offers, saves data to db and send notification via sockets'

    def handle(self, *args, **kwargs):
        travels = Travel.objects.all()
        for travel in travels:
            for offer in travel.offer_set.all():
                scrapOffer(offer)
        self.stdout.write(datetime.datetime.now().isoformat() + ' Travels data scapper and updated!') 
        # TODO some more complex comminication 
        asyncio.get_event_loop().run_until_complete(
            send_notification_to_socker('Hello word from command!')
        )
        
def scrapOffer(offer): 
    for data_provider_name in DATA_PROVIDERS:
        if (data_provider_name == offer.data_provider):
            scrapper = DATA_PROVIDERS[data_provider_name]['scrapper_instance']
            new_offer_data = scrapper.scrap([offer.url])[0]
            new_price = Price(value=new_offer_data.price, offer=offer)
            new_price.save()
            offer.current_price = new_price
            offer.title = new_offer_data.title
            offer.photo_url = new_offer_data.photo_url
            offer.save()
            return

