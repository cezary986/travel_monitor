from rest_framework import serializers
from api.models import Travel, Offer
from travel_monitor.data_providers import DATA_PROVIDERS
from django.core.exceptions import ObjectDoesNotExist

from avatars.serializers import UserSerializer as AvatarUserSerializer

class VersionSerializer(serializers.Serializer):
    version = serializers.CharField(max_length=100)

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)

class LoginCheckSerializer(serializers.Serializer):
    logged_in = serializers.BooleanField(required=True)

class UserProfileSerializer(AvatarUserSerializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=200, read_only=True)
    email = serializers.EmailField(max_length=400, read_only=True)
    first_name = serializers.CharField(max_length=200, read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    '''Here will be avatar field injected by  avatars.serializers.UserSerializer'''

class UserSerializer(AvatarUserSerializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=200, read_only=True)
    email = serializers.EmailField(max_length=400, read_only=True)
    first_name = serializers.CharField(max_length=200, read_only=True)
    '''Here will be avatar field injected by  avatars.serializers.UserSerializer'''

"""
Serializer for comment that isn't reponse - has no parent comment
"""
class OfferCommentSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    edited = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=False)
    creator = UserSerializer(many=False, read_only=True)
    content =  serializers.CharField(max_length=2000, read_only=False)
    offer = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

"""
Serializer for comments that have reponses comments - it serializes them
"""
class OfferCommentWithResponsesSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    edited = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=False)
    creator = UserSerializer(many=False, read_only=True)
    content =  serializers.CharField(max_length=2000, read_only=False)
    offer = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    responses = OfferCommentSerializer(many=True, read_only=False, source='offercomment_set')

class PriceSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    value = serializers.IntegerField(read_only=False)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)

class OfferSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=False, required=False)
    title = serializers.CharField(required=False, allow_null=True, max_length=200)
    url = serializers.CharField(required=True, allow_blank=False, max_length=1000)
    created = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True, required=False)
    photo_url = serializers.CharField(required=False, read_only=True, allow_blank=True, max_length=1000)
    last_price = PriceSerializer(many=False, read_only=True)
    current_price = PriceSerializer(many=False, read_only=True)
    date_from = serializers.DateTimeField(format="%Y-%m-%d", read_only=True, required=False)
    date_to = serializers.DateTimeField(format="%Y-%m-%d", read_only=True, required=False)
    data_provider = serializers.CharField(required=False, allow_blank=False, max_length=100)
    error = serializers.CharField(read_only=True, required=False, allow_blank=False, max_length=300)

    def get_domain_from_url(self, url):
        return (url.split('//')[-1].split('/')[0]).replace('www.', '')

    def determine_data_provider(self, domain):
        data_provider = None
        for provider in DATA_PROVIDERS:
            for domain_name in DATA_PROVIDERS[provider]['domains']:
                if domain_name == domain:
                    data_provider = DATA_PROVIDERS[provider]
                    return data_provider
    
    def process_url(self, url, data_provider):
        # Optional url processing - for example changing to mobile version of website
        for phrase, replacement in data_provider['replace_in_url']:
            url = url.replace(phrase, replacement)
        return url

    def create(self, validated_data):
        url = validated_data['url']
        domain = self.get_domain_from_url(url)
        data_provider = self.determine_data_provider(domain)
        if data_provider != None:
            url = self.process_url(url, data_provider)
            return Offer.objects.create(url=url, data_provider=data_provider['name'])
        else:
            raise serializers.ValidationError("Unsupported data_provider")

    def update(self, instance, validated_data):
        new_url = validated_data.get('url', instance.url)
        if new_url != instance.url:
            domain = self.get_domain_from_url(new_url)
            data_provider = self.determine_data_provider(domain)
            if data_provider != None:
                instance.url = self.process_url(new_url, data_provider)
                instance.data_provider = data_provider=data_provider['name']
            else:
                raise serializers.ValidationError("Unsupported data_provider")
        instance.title = validated_data.get('title', instance.title)
        instance.save()
        return instance

class TravelSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True, allow_blank=False, max_length=200)
    creator = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    created = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    best_offer = OfferSerializer(many=False, read_only=True)

    def create(self, validated_data):
        return Travel.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.save()
        return instance
