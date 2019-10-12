from django.core.exceptions import ObjectDoesNotExist
import django
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
from api.serializers import UserSerializer, UserProfileSerializer
from api.schema import UsersListReponse
from api.utils import Message
from django.contrib.auth.models import User
from rest_framework.pagination import LimitOffsetPagination
from django.conf import settings

class ProfileView(APIView):

    @login_required_view
    @swagger_auto_schema(
        operation_id='get_user_data',
        operation_description='Get current user profile data',
        responses={200: UserProfileSerializer()}
    )
    def get(self, request, format=None):
        user = request.user
        serializer = UserProfileSerializer(user)
        return JsonResponse(serializer.data, safe=False, status=200)
        
    @login_required_view
    @swagger_auto_schema(
        operation_id='update_profile_data',
        operation_description='Update current user data',
        responses={200: UserProfileSerializer}
    )
    def patch(self, request, format=None):
        data = JSONParser().parse(request)
        user = request.user
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.save()
        serializer = UserProfileSerializer(user)
        return JsonResponse(serializer.data, safe=False, status=200)
    
class UsersListView(APIView):

    @login_required_view
    @swagger_auto_schema(
        operation_id='get_all_users',
        operation_description='Get list of all users',
        responses={200: UsersListReponse}
    )
    def get(self, request, format=None):
        query = request.query_params.get('query', None)
        users = None
        if (query == None):
            users = User.objects.all()
        else:
            users = User.objects.all().filter(username__contains=query)  
        # exclude deamons users and  AnonymousUser
        users = users.exclude(username=settings.DEAMON_LOGIN)  
        users = users.exclude(username='AnonymousUser')  
        return self._make_paginated_response(users)
        
    def _make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = UserProfileSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
    