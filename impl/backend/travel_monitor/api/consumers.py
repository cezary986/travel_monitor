from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync


class OffersConsumer(WebsocketConsumer):

    channel_name = 'offers'

    def connect(self):
      self.channel_name = 'offers'
      self.group_name = 'offers'
      channel_layer = get_channel_layer()
      if channel_layer.__dict__['groups'] == {}:
        async_to_sync(self.channel_layer.group_add)(
              'offers',
              'offers'
        )
      self.accept()

    def disconnect(self, close_code):
      # async_to_sync(self.channel_layer.group_discard)(
      #   'offers',
      #   'offers'
      # )
      pass

    def receive(self, text_data):
        print(text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': 'Server: ' + message
        }))
        layer = get_channel_layer()
        async_to_sync(layer.group_send)('offers', {
          'type': 'offers.update',
          'message': message
        })

    def offers_update(self, event):
        print('\nHey')
        self.send(text_data=json.dumps({
            'message': 'Server: ' + event['content']
        }))