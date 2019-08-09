from django.http import JsonResponse
from api.models import Travel, Offer, Price
from django.core.exceptions import ObjectDoesNotExist
from api.management.commands.update_travels import scrapOffer
import django
from django.contrib import auth
from django.core import exceptions
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from api.decorators import login_required_view
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from api.serializers import PriceSerializer

class PricesListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_offer_prices',
      operation_description='Return all prices saved for offfer',
      responses={200: PriceSerializer, 404: 'If offer has no prices saved'}
    )
    @login_required_view 
    def get(self, request, offer_id, format=None):
        offer = None
        try:
            offer = Offer.objects.get(pk=offer_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No offer with given id exist'}, status=404)
        try:
            prices = Price.objects.filter(offer=offer)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No prices for this offer'}, status=404)
        serializer = PriceSerializer(prices, many=True)
        return JsonResponse(serializer.data, safe=False)