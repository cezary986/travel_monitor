from channels.generic.websocket import AsyncWebsocketConsumer
import json
from travel_monitor.settings import DEAMON_LOGIN, DEAMON_PASSWORD
from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync


class OffersConsumer(AsyncWebsocketConsumer):

    channel_name = 'offer'
    group_name = 'offers'

    async def connect(self):
        self.user = self.scope["user"]
        print(self.user.username)
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
        text_data_json = json.loads(text_data)
        self.user = self.scope["user"]
        if self.user.is_authenticated and self.user.username == DEAMON_LOGIN:
            text_data_json = json.loads(text_data)
            await self.channel_layer.group_send(self.group_name, {
                'type': 'receive_offers_update',
                'message': text_data
            })
        

    async def receive_offers_update(self, event):
        # Send message to WebSocket
        await self.send(
             text_data=event['message'])
