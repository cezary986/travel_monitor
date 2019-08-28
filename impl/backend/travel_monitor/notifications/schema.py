from notifications.serializers import NotificationSerializer
from rest_framework import serializers

class PaginatedListResponse(serializers.Serializer):
    count = serializers.IntegerField(read_only=True)
    next = serializers.CharField(max_length=500, read_only=True)
    previous = serializers.CharField(max_length=500, read_only=True)

class NotificationsListReponse(PaginatedListResponse):
    results = NotificationSerializer(many=True)