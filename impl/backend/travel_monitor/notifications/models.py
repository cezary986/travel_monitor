from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Event(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    type = models.ForeignKey('EventType', on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=200, null=False)
    message = models.CharField(max_length=1000, null=True, blank=True)
    data = models.TextField(null=True, blank=True)

    class Meta:
        app_label = 'notifications'

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    readed = models.DateTimeField(null=True, blank=True)
    event = models.ForeignKey('Event', on_delete=models.CASCADE, null=False)

    class Meta:
        app_label = 'notifications'

class NotificationsFilter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    types_enabled = models.ManyToManyField('EventType')

    class Meta:
        app_label = 'notifications'

class EventType(models.Model):
    # name used while sending notification
    name = models.CharField(unique=True, max_length=100, choices=settings.EVENT_TYPES, null=False)
    # something more user-readable
    title =   models.CharField(unique=True, max_length=300, null=False)
    description = models.CharField(max_length=1000, null=True, blank=True)

    class Meta:
        app_label = 'notifications'