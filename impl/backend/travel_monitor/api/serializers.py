from rest_framework import serializers
from api.models import Travel, Offer
from travel_monitor.data_providers import DATA_PROVIDERS

class PriceSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    value = serializers.IntegerField(read_only=False)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)

class OfferSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=False, required=False)
    title = serializers.CharField(required=False, allow_blank=False, max_length=200)
    url = serializers.CharField(required=True, allow_blank=False, max_length=1000)
    photo_url = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    current_price = PriceSerializer(many=False, read_only=True)
    data_provider = serializers.CharField(required=False, allow_blank=False, max_length=100)

    def create(self, validated_data):
        url = validated_data['url']
        domain = url.split('//')[-1].split('/')[0]
        print(domain)
        data_provider = None
        for provider in DATA_PROVIDERS:
            for domain_name in DATA_PROVIDERS[provider]['domain']:
                if domain_name == domain:
                    data_provider = DATA_PROVIDERS[provider]
                    break
            if data_provider != None:
                break
        if data_provider != None:
            # Optional url processing - for example changing to mobile version of website
            for phrase, replacement in data_provider['replace_in_url']:
                url = url.replace(phrase, replacement)
            return Offer.objects.create(url=url, data_provider=data_provider['name'])
        else:
            raise serializers.ValidationError("Unsupported data_provider")

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
