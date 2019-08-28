from channels.routing import ProtocolTypeRouter
from django.conf.urls import url
from api import consumers
import api.routing
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.routing import ProtocolTypeRouter, ChannelNameRouter

import notifications.routing 

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            api.routing.websocket_urlpatterns + 
            notifications.routing.websocket_urlpatterns
        )
    )
})