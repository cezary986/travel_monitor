from rest_framework import serializers
from api.models import Travel, Offer

class PriceSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    value = serializers.IntegerField(read_only=False)
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)

class OfferSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(required=True, allow_blank=False, max_length=200)
    url = serializers.CharField(required=True, allow_blank=False, max_length=1000)
    photo_url = serializers.CharField(required=False, allow_blank=True, max_length=1000)
    current_price = PriceSerializer(many=False, read_only=True)
    data_provider = serializers.CharField(required=True, allow_blank=False, max_length=100)

    def create(self, validated_data):
        return Offer.objects.create(**validated_data)

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
