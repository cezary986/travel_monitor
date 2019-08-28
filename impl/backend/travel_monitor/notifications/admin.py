from django.contrib import admin
from notifications.receivers import connect_receivers
# Register your models here.
from notifications.models import Notification, Event, EventType, NotificationsFilter

connect_receivers()

admin.site.register(Notification)
admin.site.register(Event)
admin.site.register(EventType)
admin.site.register(NotificationsFilter)