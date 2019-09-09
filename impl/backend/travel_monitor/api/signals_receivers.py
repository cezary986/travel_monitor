import api.signals as signals

from notifications.helpers import send_notification
from notifications.serializers import EventSerializer

from api.serializers import UserProfileSerializer, OfferSerializer

def connect_receivers():
    signals.travel_create.connect(travel_create)
    signals.travel_delete.connect(travel_delete)
    signals.offer_create.connect(offer_create)
    signals.offer_delete.connect(offer_delete)
    signals.offer_elapse.connect(offer_elapse)
    signals.test.connect(test)
    
def travel_create(sender, **kwargs):
    user = kwargs['user']
    travel = kwargs['travel']
    title='Dodano nową podróż!'
    message=user.username + ' dodał(a) nową podróż o nazwie: ' + travel.title
    author=user
    data = {
        'travel_id': travel.pk,
        'author': UserProfileSerializer(user).data
    }
    event = send_notification(
        type='travel_create', 
        title=title, 
        author=author, 
        message=message, 
        data=data
    )
    serializer = EventSerializer(event)
    
def travel_delete(sender, **kwargs):
    user = kwargs['user']
    travel = kwargs['travel']
    title = 'Usunięto podróż!'
    message = user.username + ' usunął(a) podróż o nazwie: ' + travel.title
    author = user
    data = {
        'author': UserProfileSerializer(user).data
    }
    send_notification(
        type='travel_delete', 
        title=title, 
        author=author, 
        message=message,
        data=data
    )

def offer_elapse(sender, **kwargs):
    offer = kwargs['offer']
    send_notification(
        type='offer_elapse', 
        title='Oferta wygasła!', 
        message= 'Oferta: ' + offer.title + ' wygasła',
        data=OfferSerializer(offer).data
    )

def offer_create(sender, **kwargs):
    user = kwargs['user']
    offer = kwargs['offer']
    message = user.username + ' dodał(a) nową oferte o nazwie: ' + offer.title + 'do podróży: ' + offer.travel.title
    send_notification(
        type='offer_create', 
        title='Dodano nową oferte!', 
        message=message,
        author=user,
        data={
            'offer_id': offer.pk,
            'author': UserProfileSerializer(user).data
        }
    )
    
def offer_delete(sender, **kwargs):
    user = kwargs['user']
    offer = kwargs['offer']
    message = user.username + ' usunął(a) oferte o nazwie: ' + offer.title + ' z podróży: ' + offer.travel.title
    send_notification(
        type='offer_delete', 
        title='Usunięto oferte!', 
        message=message,
        author=user,
        data={
            'author': UserProfileSerializer(user).data
        }
    )

def test(sender, **kwargs):
    message = 'Test message'
    send_notification(
        type='test', 
        title='Test', 
        message=message,
    )