import api.signals as signals
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from api.serializers import NotificationSerializer
from api.models import Notification

def connect_receivers():
    signals.travel_create.connect(travel_create)
    signals.travel_delete.connect(travel_delete)
    signals.offer_create.connect(offer_create)
    signals.offer_delete.connect(offer_delete)
    signals.offer_elapse.connect(offer_elapse)

def raiseNotification(notification):
    channel_layer = get_channel_layer()
    serializer = NotificationSerializer(notification)
    async_to_sync(channel_layer.group_send)("notifications",{
        "type": "receive_notification",
        "message": serializer.data
    })
    
def travel_create(sender, **kwargs):
    user = kwargs['user']
    travel = kwargs['travel']
    notification = Notification.objects.create(
        title='Dodano nową podróż!',
        message=user.username + ' dodał(a) nową podróż o nazwie: ' + travel.title,
        creator=user
    )
    notification.save()
    raiseNotification(notification)
    
def travel_delete(sender, **kwargs):
    user = kwargs['user']
    travel = kwargs['travel']
    notification = Notification.objects.create(
        title='Usunięto podróż!',
        message=user.username + ' usunął(a) podróż o nazwie: ' + travel.title,
        creator=user
    )
    notification.save()
    raiseNotification(notification)

def offer_elapse(sender, **kwargs):
    offer = kwargs['offer']
    notification = Notification.objects.create(
        title='Oferta wygasła!',
        message='Oferta: ' + offer.title + ' wygasła',
        creator=None
    )
    notification.save()
    raiseNotification(notification)

def offer_create(sender, **kwargs):
    user = kwargs['user']
    offer = kwargs['offer']
    notification = Notification.objects.create(
        title='Dodano nową oferte!',
        message=user.username + ' dodał(a) nową oferte o nazwie: ' + offer.title + 'do podróży: ' + offer.travel.title,
        creator=user
    )
    notification.save()
    raiseNotification(notification)
    
def offer_delete(sender, **kwargs):
    user = kwargs['user']
    offer = kwargs['offer']
    notification = Notification.objects.create(
        title='Usunięto oferte!',
        message=user.username + ' usunął(a) oferte o nazwie: ' + offer.title + ' z podróży: ' + offer.travel.title,
        creator=user
    )
    notification.save()
    raiseNotification(notification)