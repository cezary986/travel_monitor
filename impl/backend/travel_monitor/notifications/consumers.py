from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from django.core.exceptions import ObjectDoesNotExist
from asgiref.sync import async_to_sync
import json

class NotificationsConsumer(AsyncWebsocketConsumer):

    channel_name = 'notification'
    group_name = 'notifications'

    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated or True:
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            print('Unathorized socket access')

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def receive_notification(self, event):
        # Send message to WebSocket
        print('receive_notification')
        audience = event.get('audience', None)
        event_id = event.get('message', None)
        notification = None
        try:
            notification = Notification.objects.get(event_id=event_id, user=self.user)
        except ObjectDoesNotExist as error:
            print('Error sending notification \n' + str(error))
        print(notification)
        if audience.get(self.user.pk, False):
            serializer = NotificationSerializer(notification)
            message = {
                'action': 'new',
                'notification': serializer.data
            }
            await self.send(text_data=json.dumps(message))

    async def notification_readed(self, event):
        print('notification_readed')
        notification_id = event.get('id', None)
        notification = None
        try:
            notification = Notification.objects.get(pk=notification_id)
        except ObjectDoesNotExist as error:
            print('Error marking notification as readed \n' + str(error))
        serializer = NotificationSerializer(notification)
        message = {
            'action': 'readed',
            'notification': serializer.data
        }
        await self.send(text_data=json.dumps(message))
