from django.http import JsonResponse
from api.models import Travel
from django.core.exceptions import ObjectDoesNotExist
from api.management.commands.update_travels import scrapOffer
import django
from django.contrib import auth
from django.core import exceptions
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from api.decorators import login_required_view
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from api.serializers import TravelSerializer, MessageSerializer
from api.utils import Message
from api.signals import travel_create, travel_delete

class TravelsListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_travels',
      operation_description='Return all travels in system',
      responses={200: TravelSerializer(many=True)}
    )
    @login_required_view
    def get(self, request, format=None):
        travels = Travel.objects.all()
        serializer = TravelSerializer(travels, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    @swagger_auto_schema(
      operation_id='create_new_travel',
      request_body=TravelSerializer,
      operation_description='Create new travel',
      responses={200: TravelSerializer}
    )
    @login_required_view
    def post(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = TravelSerializer(data=data)
        if serializer.is_valid():
            travel = serializer.save()
            # send notification
            travel_create.send(sender=self.__class__, user=request.user, travel=travel)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, safe=False, status=400)

class TravelDetailView(APIView):
  
    @login_required_view
    @swagger_auto_schema(
      operation_id='get_travel',
      operation_description='Get travel',
      responses={200: TravelSerializer}
    )
    def get(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No travel with given id exists'))
            return JsonResponse(serializer.data, status=404)
        serializer = TravelSerializer(travel)
        return JsonResponse(serializer.data, status=200)
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='delete_travel',
      operation_description='Delete travel',
      responses={200: '{"message": "Travel deleted"}'}
    )
    def delete(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No travel with given id exist'}, status=404)
        travel.delete()
        # send notification
        travel_delete.send(sender=self.__class__, user=request.user, travel=travel)
        return JsonResponse({'message': 'Travel deleted'}, safe=False, status=200)
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='update_travel',
      operation_description='Update travel',
      responses={200: ''}
    )
    def patch(self, request, travel_id, format=None):
        data = JSONParser().parse(request)
        serializer = TravelSerializer(data=data, partial=True)
        travel = None
        if serializer.is_valid():
            try:
                travel = Travel.objects.get(pk=travel_id)
            except ObjectDoesNotExist:
                return JsonResponse({"message": 'No travel with given id exist'}, status=404)
            travel.title = data.title
            travel.save()
            serializer = TravelSerializer(travel)
            return JsonResponse(serializer.data, safe=False, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
        