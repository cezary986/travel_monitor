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
from rest_framework.pagination import LimitOffsetPagination
from api.schema import PricesListReponse

class PricesListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_offer_prices',
      operation_description='Return all prices saved for offfer',
      responses={200: PricesListReponse, 404: 'If offer has no prices saved'}
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
        return self._make_paginated_response(prices)

    def _make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = PriceSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)