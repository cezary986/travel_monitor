from rest_framework import serializers
from notifications.models import Notification, NotificationsFilter
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
import json
  
class EventTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, read_only=True)
    title = serializers.CharField(max_length=300, read_only=True)
    description = serializers.CharField(max_length=1000, read_only=True)

class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    type = EventTypeSerializer(many=False)
    title = serializers.CharField(max_length=200, read_only=True)
    message = serializers.CharField(max_length=1000, read_only=True)
    # Here is a injected json field 'data'

    """
    Overriding serialization to inject data field
    """
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.data != None:
            data_object = json.loads(instance.data)
            ret['data'] = data_object
        else:
            ret['data'] = None
        return ret
  
class NotificationSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    readed = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    event = EventSerializer(many=False, read_only=True)

class NotificationsFilterSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    types_enabled = EventTypeSerializer(many=True)
