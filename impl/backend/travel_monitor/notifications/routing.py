from django.conf.urls import url
from notifications import consumers

websocket_urlpatterns = [
    url(r'^ws/notifications$', consumers.NotificationsConsumer),
]