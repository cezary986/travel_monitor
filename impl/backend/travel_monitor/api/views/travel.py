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
from api.serializers import TravelSerializer, MessageSerializer, UserProfileSerializer
from api.utils import Message
from api.signals import travel_create, travel_delete
from rest_framework.pagination import LimitOffsetPagination
from api.schema import TravelsListReponse
import datetime
from guardian.shortcuts import assign_perm
from guardian.shortcuts import get_objects_for_user, get_users_with_perms, remove_perm

class TravelsListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_travels',
      operation_description='Return all travels in system',
      responses={200: TravelsListReponse()}
    )
    @login_required_view
    def get(self, request, format=None):
        travels = get_objects_for_user(
            request.user, 
            "get_travel", 
            Travel.objects.all()
            ).order_by('-created')
        return self._make_paginated_response(travels)

    def _make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = TravelSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
    
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
            travel.creator = request.user
            travel.save()
            # assign permissions
            assign_perm('get_travel', request.user, travel)
            assign_perm('patch_travel', request.user, travel)
            assign_perm('remove_travel', request.user, travel)
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
        # check persmissions
        if request.user.has_perm('get_travel', travel):
            serializer = TravelSerializer(travel)
            return JsonResponse(serializer.data, status=200)
        else:
            serializer = MessageSerializer(Message('You have no permission for this travel'))
            return JsonResponse(serializer.data, status=403)  
      
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
        # check persmissions
        if request.user.has_perm('remove_travel', travel):
            travel.delete()
            # send notification
            travel_delete.send(sender=self.__class__, user=request.user, travel=travel)
            return JsonResponse({'message': 'Travel deleted'}, safe=False, status=200)
        else:
            serializer = MessageSerializer(Message('You have no permission to delete this travel'))
            return JsonResponse(serializer.data, status=403)   
      
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
            # check persmissions
            if request.user.has_perm('patch_travel', travel):
                travel.title = data['title']
                travel.save()
                serializer = TravelSerializer(travel)
                return JsonResponse(serializer.data, safe=False, status=201)
            else:
                serializer = MessageSerializer(Message('You have no permission to edit this travel'))
                return JsonResponse(serializer.data, status=403)   
        else:
            return JsonResponse(serializer.errors, status=400)
        
class TravelUsersView(APIView):
  
    @login_required_view
    @swagger_auto_schema(
      operation_id='get_travel_users',
      operation_description='Get all users who could access travel',
      responses={200: UserProfileSerializer(many=True)}
    )
    def get(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No travel with given id exists'))
            return JsonResponse(serializer.data, status=404)
        user_with_permission = get_users_with_perms(travel, attach_perms=True)
        permission_name = "get_travel"
        user_with_permission = [ k for k, v in user_with_permission.items() if permission_name in v ]
        serializer = UserProfileSerializer(user_with_permission, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)   
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='delete_travel_user',
      operation_description='Remove user access to travel',
      responses={200: '{"message": "Travel access removed"}'}
    )
    def delete(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No travel with given id exists'))
            return JsonResponse(serializer.data, status=404)
        data = JSONParser().parse(request)
        user_id = data.get('user_id', None)
        if (user_id == None):
            serializer = MessageSerializer(Message('No user id specified'))
            return JsonResponse(serializer.data, status=400)
        user = None
        try:
            user = User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No user with given id exists'))
            return JsonResponse(serializer.data, status=404)
        if user.has_perm('get_travel', travel):
            remove_perm('get_travel', user, travel)
        if user.has_perm('patch_travel', travel):
            remove_perm('patch_travel', user, travel)
        if user.has_perm('remove_travel', travel):
            remove_perm('remove_travel', user, travel)
        serializer = MessageSerializer(Message('Travel access removed'))
        return JsonResponse(serializer.data, status=200)
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='add_user_to_travel',
      operation_description='Add access for user to certain travel',
      responses={200: '{"message": "Travel access granted"}'}
    )
    def post(self, request, travel_id, format=None):
        travel = None
        try:
            travel = Travel.objects.get(pk=travel_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No travel with given id exists'))
            return JsonResponse(serializer.data, status=404)
        data = JSONParser().parse(request)
        user_id = data.get('user_id', None)
        if (user_id == None):
            serializer = MessageSerializer(Message('No user id specified'))
            return JsonResponse(serializer.data, status=400)
        user = None
        try:
            user = User.objects.get(pk=user_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No user with given id exists'))
            return JsonResponse(serializer.data, status=404)
        if not user.has_perm('get_travel', travel):
            assign_perm('get_travel', user, travel)
        if not user.has_perm('patch_travel', travel):
            assign_perm('patch_travel', user, travel)
        serializer = MessageSerializer(Message('Travel access granted'))
        return JsonResponse(serializer.data, status=200)
        