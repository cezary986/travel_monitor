from django.contrib.auth.models import User
import json
from notifications.models import Event, Notification, EventType
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from notifications.serializers import NotificationSerializer
from notifications.models import Notification, NotificationsFilter
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist

""" 
Sends notification to user specified in 'users' param. If no value is supplied it sends
it to all users in app
"""
def send_notification(type, title, **kwargs):
    author = kwargs.get('author', None)
    message = kwargs.get('message', None)
    data = kwargs.get('data', None)
    data = json.dumps(data)
    try:
        type = EventType.objects.get(name=type)
    except ObjectDoesNotExist as error:
        print('Invalid notification type given! "' + type + '" was not decalared as event type')
        raise error
    audience = kwargs.get('users', User.objects.all())
    filters_hash_map = _get_audience_filters_hash_map(audience)
    event = _create_event(type=type, title=title, author=author, message=message, data=data)
    audience_map = {}
    for user in audience:
        filter = filters_hash_map.get(user.pk, None)
        if filter == None or filter.types_enabled.filter(id=type.id).exists():
            notification = Notification(user=user, event=event)
            notification.save()
            audience_map[user.pk] = True
        else:
            del audience_map[user.pk] 
    _send_by_socket(event, audience_map)
    return event

def _send_by_socket(event, audience_map):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("notifications", {
        "type": "receive_notification",
        "message": event.pk,
        "audience": audience_map
    })

def mark_as_readed(notification):
    notification.readed = datetime.now()
    notification.save()
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("notifications", {
        "type": "notification_readed",
        "id": notification.pk,
    })

def _create_event(type, title, data, message, author):
    event = Event(author=author, type=type, title=title,
                  message=message, data=data)
    event.save()
    return event
    

def _get_audience_filters_hash_map(users):
    filters  = NotificationsFilter.objects.filter(user__in=users)
    filter_hash_map = {}
    for filter in filters:
        filter_hash_map[filter.user.pk] = filter
    return filter_hash_map
