from channels.generic.websocket import AsyncWebsocketConsumer
import json
from travel_monitor.settings import DEAMON_AUTH_CODE
from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync


class OffersConsumer(AsyncWebsocketConsumer):

    channel_name = 'offer'
    group_name = 'offers'

    async def connect(self):
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message', '')
        # Send message only from deamon webscraping process
        auth_code = text_data_json.get('auth', None)
        if auth_code == DEAMON_AUTH_CODE:
          await self.channel_layer.group_send(
              self.group_name,
              {
                  'type': 'recieve_group_message',
                  'message': message
              }
          )

    async def recieve_group_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(
             text_data=json.dumps({
            'message': message
        }))