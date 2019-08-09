from api import VERSION
from django.http import JsonResponse
import django
from django.contrib import auth
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from travel_monitor.data_providers import DATA_PROVIDERS
from api.decorators import login_required_view
from api.serializers import VersionSerializer

class VersionView(APIView):
  
    @swagger_auto_schema(
        operation_id='version',
        operation_description='Return current API version',
        responses={200: VersionSerializer}
    )
    def get(self, request):
        serializer = VersionSerializer({'version': VERSION})
        return JsonResponse(serializer.data)

class SupportedDomainsView(APIView):

    @swagger_auto_schema(
        operation_id='list_all_supported_websites_domains',
        operation_description='Return all websites domains which could be scrapped by the system',
        responses={200: '',}
    )
    @login_required_view 
    def get(self, request, format=None):
        supported_domains = []
        for data_provider in DATA_PROVIDERS:
            supported_domains.append(DATA_PROVIDERS[data_provider]['domain'])
        return JsonResponse(supported_domains, safe=False, status=200)