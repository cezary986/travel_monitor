from django.shortcuts import render
from api import VERSION
from django.http import HttpResponse
from django.http import JsonResponse

from api.models import Travel, Offer, Price
from django.core.exceptions import ObjectDoesNotExist
from api.management.commands.update_travels import scrapOffer
import threading
import json
import django
import os
from django import urls
from django.contrib import auth
from django.core import exceptions
from django.http.response import HttpResponse
from django.http.response import JsonResponse
from django.http.response import HttpResponseForbidden
from django.http.response import HttpResponseBadRequest
from django.http.response import HttpResponseNotFound
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from api.decorators import login_required, require_http_methods, login_required_view
from travel_monitor.settings import TOKEN_LIFE_TIME
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema

from api.serializers import TravelSerializer, OfferSerializer, PriceSerializer

@swagger_auto_schema(
    operation_id='version',
    operation_description='Return current API version',
    responses={200: ''}
)
def version(request):
    return JsonResponse({'version': VERSION })

"""
Login view taking two params: username and password
"""
@require_http_methods(["POST"])
@swagger_auto_schema(
    operation_id='login',
    operation_description='Login to system with given username and password passed in json body',
    responses={200: 'When credentials were correct'}
)
def login(request):
    try:
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        username = body['username']
        password = body['password']
    except KeyError:
        return HttpResponseBadRequest('No username or password field')

    user = auth.authenticate(request, username=username, password=password)
    if user is not None:
        request.session.set_expiry(TOKEN_LIFE_TIME)
        auth.login(request, user)
        return JsonResponse({'message': 'Logged in'}, status=200)
    else:
        return JsonResponse({"message": 'Invalid login or password'}, status=401)

"""
View for logging out
"""
@require_http_methods(["POST"])
@swagger_auto_schema(
    operation_id='logout',
    operation_description='Logout from the system',
    responses={200: ''}
)
def logout(request):
    auth.logout(request)
    return JsonResponse({'message': 'Logged out'}, status=200)

"""
View for checking if user is logged in or not
"""
@require_http_methods(["GET"])
@swagger_auto_schema(
    operation_id='check_login_status',
    operation_description='Simple endpoint to check if user is logged in.',
    responses={200: 'If is logged in', 403: 'If not'}
)
def check_login(request):    
    return JsonResponse({
        'logged_in': request.user.is_authenticated
    }, status=200) 


class TravelsListView(APIView):
  
    @login_required_view
    @swagger_auto_schema(
      operation_id='list_all_travels',
      operation_description='Return all travels in system',
      responses={200: ''}
    )
    def get(self, request, format=None):
        travels = Travel.objects.all()
        serializer = TravelSerializer(travels, many=True)
        return JsonResponse(serializer.data, safe=False)
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='create_new_travel',
      operation_description='Create new travel',
      responses={200: ''}
    )
    def post(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = TravelSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, safe=False, status=400)

class OffersListView(APIView):
  
    @login_required_view
    @swagger_auto_schema(
      operation_id='list_all_offers',
      operation_description='Return all offers connected to travel with given id',
      responses={200: '', 404: 'If no travel with given id exist or travel has no offers'}
    )
    def get(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No travel with given id exist'}, status=404)
        try:
            offers = Offer.objects.filter(travel=travel)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No offers for this travel'}, status=404)
        serializer = OfferSerializer(offers, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    @login_required_view
    @swagger_auto_schema(
      operation_id='add_offer_to_travel',
      operation_description='Create offer and save it to travel',
      responses={200: '', 400: 'For corrupted body'}
    )
    def post(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = OfferSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

class PricesListView(APIView):
  
    @login_required_view
    @swagger_auto_schema(
      operation_id='list_all_offer_prices',
      operation_description='Return all prices saved for offfer',
      responses={200: '', 404: 'If offer has no prices saved'}
    )
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