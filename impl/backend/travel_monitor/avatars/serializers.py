from rest_framework import serializers
from avatars.models import Avatar
from django.core.exceptions import ObjectDoesNotExist

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)

class AvatarSerializer(serializers.Serializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

class UserSerializer(serializers.Serializer):
    """
    Overriding serialization to inject avatar field
    """
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        avatar = None
        try:
            avatar = Avatar.objects.get(user=instance)
            serializer = AvatarSerializer(avatar)
            ret['avatar'] = serializer.data
        except ObjectDoesNotExist:
            ret['avatar'] = avatar
        return ret