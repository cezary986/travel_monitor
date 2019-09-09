from django.http import JsonResponse
from notifications.models import Notification, NotificationsFilter, EventType
from django.core.exceptions import ObjectDoesNotExist
import django
from django.contrib import auth
from django.core import exceptions
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from notifications.decorators import login_required_view
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from notifications.serializers import NotificationSerializer, EventTypeSerializer, NotificationsFilterSerializer
from notifications.schema import  NotificationsListReponse
from notifications.utils import Message
from datetime import datetime
from notifications.helpers import mark_as_readed
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from rest_framework.pagination import LimitOffsetPagination

def _get_user_filter_or_create(user):
    notification_filter = None
    try:
        notification_filter = NotificationsFilter.objects.get(user=user)
    except ObjectDoesNotExist:
        # by default user has all event's types enabled
        notification_filter = NotificationsFilter.objects.create(
        user=user)
        notification_filter.types_enabled.set(EventType.objects.all())
    return notification_filter

class NotificationsListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_user_notifications',
      operation_description='Return all notifications for user',
      responses={200: NotificationsListReponse()}
    )
    @login_required_view
    def get(self, request, format=None):
        notification_filter = _get_user_filter_or_create(request.user)
        notifications = Notification.objects.filter(
            user=request.user, 
            event__type__in=notification_filter.types_enabled.all()).order_by('-event__timestamp')
        try:
            notifications = self._filter_data(notifications, notification_filter)
            return self.make_paginated_response(notifications)
        except Exception as error:
            return JsonResponse({'message': 'Wrong filters: ' + str(error)}, status=400)
        

    """
    Filters queryset by request params filters.
    """
    def _filter_data(self, queryset, notification_filter):
        readed = self.request.query_params.get('readed', None)
        if readed is not None:
            if readed == 'true':
                # get rows where readed != None
                queryset =  queryset.filter(readed__isnull=False)
            elif readed == 'false':
                queryset = queryset.filter(readed=None)
            else:
                readed_datetime = parse_datetime(readed)
                if (readed_datetime == None):
                    raise Exception('"readed" param should be valid timestamp string in format: "YYYY-MM-DDTHH:MM:SS"')
                queryset = queryset.filter(readed=readed_datetime)    
        return queryset

    "Quick pagination"
    def make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = NotificationSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    @login_required_view
    @swagger_auto_schema(
      operation_id='mark_notifications_as_readed',
      operation_description='Mark notifications as readed',
      responses={200: ''}
    )
    def patch(self, request, format=None):
        data = JSONParser().parse(request)
        id_list = data
        if id_list != None and isinstance(id_list, list):
            notifications = []
            try:
                notifications = Notification.objects.filter(id__in=id_list, user=request.user)
            except ObjectDoesNotExist:
                return JsonResponse({"message": 'No notification with given ids exist'}, status=404)
            for notification in notifications:
                mark_as_readed(notification)
            return JsonResponse({"message": 'Notifications marked as readed'},safe=False, status=200)
        else:
            return JsonResponse({"message": 'Request body does not contain id array'},safe=False, status=400)

class NotificationDetailView(APIView):
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='delete_notification',
      operation_description='Delete notification',
      responses={200: '{"message": "Notification deleted"}'}
    )
    def delete(self, request, notification_id, format=None):
        notification = None
        try:
            notification = Notification.objects.filter(user=request.user).get(pk=notification_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No notification with given id exist'}, status=404)
        notification.delete()
        return JsonResponse({'message': 'Notification deleted'}, safe=False, status=200)
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='mark_notification_as_readed',
      operation_description='Mark notification as readed',
      request_body=NotificationSerializer,
      responses={200: NotificationSerializer}
    )
    def patch(self, request, notification_id, format=None):
        notification = None
        try:
            notification = Notification.objects.filter(user=request.user).get(pk=notification_id)
        except ObjectDoesNotExist:
            return JsonResponse({"message": 'No notification with given id exist'}, status=404)
        mark_as_readed(notification)
        return JsonResponse({"message": 'Notification marked as readed'},safe=False, status=200)
        

class NotificationFilterView(APIView):
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='get_user_notifications_filter',
      operation_description="Get user notification's filter",
      responses={200: NotificationsFilterSerializer}
    )
    def get(self, request, format=None):
        notification_filter = _get_user_filter_or_create(request.user)
        serializer = NotificationsFilterSerializer(notification_filter)
        return JsonResponse(serializer.data, safe=False, status=200)

    @login_required_view
    @swagger_auto_schema(
      operation_id='update_user_notification_filter',
      operation_description="Update user's notifications's filter",
      responses={200: NotificationsFilterSerializer}
    )
    def patch(self, request, format=None):
        data = JSONParser().parse(request)
        serializer = NotificationsFilterSerializer(data=data, partial=True)
        if serializer.is_valid():
            notification_filter = _get_user_filter_or_create(request.user)
            types_ids = []
            for el in data['types_enabled']:
                types_ids.append(el['id'])
            types_enabled = EventType.objects.filter(pk__in=types_ids)
            if (types_enabled != None):
                notification_filter.types_enabled.set(types_enabled)
                notification_filter.save()
                serializer = NotificationsFilterSerializer(notification_filter)
                return JsonResponse(serializer.data, status=200)
        else:
            return JsonResponse(serializer.errors, status=400)
        

class EventsTypeListView(APIView):
      
    @login_required_view
    @swagger_auto_schema(
      operation_id='get_notifications_types',
      operation_description="Get possible notification's event's types",
      responses={200: EventTypeSerializer(many=True)}
    )
    def get(self, request, format=None):
        types = EventType.objects.all()
        serializer = EventTypeSerializer(types)
        return JsonResponse(serializer.data, safe=False, status=200)
