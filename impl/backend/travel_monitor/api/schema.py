from api.serializers import TravelSerializer, PriceSerializer, OfferSerializer, OfferCommentSerializer
from rest_framework import serializers

class PaginatedListResponse(serializers.Serializer):
    count = serializers.IntegerField(read_only=True)
    next = serializers.CharField(max_length=500, read_only=True)
    previous = serializers.CharField(max_length=500, read_only=True)

class TravelsListReponse(PaginatedListResponse):
    results = TravelSerializer(many=True)

class OffersListReponse(PaginatedListResponse):
    results = OfferSerializer(many=True)

class OfferCommentsListReponse(PaginatedListResponse):
    results = OfferCommentSerializer(many=True)

class PricesListReponse(PaginatedListResponse):
    results = PriceSerializer(many=True)