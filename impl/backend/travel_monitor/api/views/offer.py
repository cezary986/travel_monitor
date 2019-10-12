from api.models import Travel, Offer
from django.core.exceptions import ObjectDoesNotExist
from api.management.commands.update_travels import scrapOffer
import json
import django
from django import urls
from django.contrib import auth
from django.core import exceptions
from django.http.response import HttpResponse
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.parsers import JSONParser
from api.decorators import login_required_view
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from threading import Thread
from api.serializers import OfferSerializer, MessageSerializer
from api.utils import Message
from rest_framework.pagination import LimitOffsetPagination
from api.schema import OffersListReponse
import datetime
from guardian.shortcuts import get_perms

class OffersListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_offers',
      operation_description='Return all offers connected to travel with given id',
      responses={200: OffersListReponse, 404: 'If no travel with given id exist or travel has no offers'}
    )
    @login_required_view
    def get(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No travel with given id exist'}, status=404)
        # check persmissions
        if request.user.has_perm('get_travel', travel):
            offers = Offer.objects.filter(travel=travel, date_from__gt=datetime.datetime.now()).order_by('-created')
            return self._make_paginated_response(offers)
        else:
            return JsonResponse({"message": 'You have no permission for this travel'}, status=403)
    
    def _make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = OfferSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
      operation_id='add_offer_to_travel',
      operation_description='Create offer and save it to travel',
      responses={200: OfferSerializer, 400: 'For corrupted body'}
    )
    @login_required_view
    def post(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No travel with given id exist'}, status=404)    
        # check persmissions
        if request.user.has_perm('patch_travel', travel):
            data = JSONParser().parse(request)
            serializer = OfferSerializer(data=data)
            if serializer.is_valid():
                model = serializer.save()
                model.creator = request.user
                model.travel = travel
                model.save()
                thread = Thread(target=scrapOffer, args = [model, True])
                thread.start()
                return JsonResponse(serializer.data, status=201)
            else:
                return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({"message": 'You have no permissions for this travel'}, status=403)    

class OfferDetailView(APIView):

    @login_required_view
    @swagger_auto_schema(
        operation_id='delete_offer',
        operation_description='Delete offer',
        responses={200: '{"message": "Offer deleted"}'}
    )
    def delete(self, request, offer_id, format=None):
        offer = None
        try:
            offer = Offer.objects.get(pk=offer_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No offer with given id exist'))
            return JsonResponse(serializer.data, status=404)
        # check persmissions
        if request.user.has_perm('patch_travel', offer.travel):
            offer.delete()
            serializer = MessageSerializer(Message('Offer deleted'))
            return JsonResponse(serializer.data, safe=False, status=200)
        else:
            return JsonResponse({"message": 'You have no permissions for this travel'}, status=403) 
        
        
    @login_required_view
    @swagger_auto_schema(
        operation_id='update_offer',
        operation_description='Update offer',
        responses={200: ''}
    )
    def patch(self, request, offer_id, format=None):
        data = JSONParser().parse(request)
        serializer = OfferSerializer(data=data, partial=True)
        offer = None
        if serializer.is_valid():
            try:
                offer = Offer.objects.get(pk=offer_id)
            except ObjectDoesNotExist:
                serializer = MessageSerializer(Message('No offer with given id exist'))
                return JsonResponse(serializer.data, status=404)
            # check persmissions
            if request.user.has_perm('patch_travel', offer.travel):
                offer.title = data.get('title', offer.title)
                offer.url = data.get('url', offer.url)
                offer.save()
                serializer = OfferSerializer(offer)
                thread = Thread(target=scrapOffer, args = [offer, True])
                thread.start()
                return JsonResponse(serializer.data, status=201)
            else:
                return JsonResponse({"message": 'You have no permissions for this travel'}, status=3) 
        else:
            return JsonResponse(serializer.errors, safe=False, status=400)

class OffersArchivedListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_archived_offers',
      operation_description='Return all offers that have already started ar finished',
      responses={200: OffersListReponse}
    )
    @login_required_view
    def get(self, request, format=None, **kwargs):
        travel_id = kwargs.get('travel_id', None)
        offers = Offer.objects.filter(date_from__gt=datetime.datetime.now())
        if travel_id != None:
            travel = None
            try:
                travel = Travel.objects.get(pk=travel_id)
            except ObjectDoesNotExist:
                return JsonResponse({"message": 'No travel with given id exist'}, status=404)
            # check persmissions
            if request.user.has_perm('get_travel', travel):
                offers = offers.filter(travel=travel)
                return self._make_paginated_response(offers)
            else:
                return JsonResponse({"message": 'You have no permissions for this travel'}, status=403) 
        else:
            return JsonResponse({"message": 'No travel id given'}, status=400)   

    def _make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = OfferSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)