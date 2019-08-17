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
from api.utils import Message
from django.contrib.auth.models import User


class ProfileView(APIView):

    @login_required_view
    @swagger_auto_schema(
        operation_id='get_user_data',
        operation_description='Get current user profile data',
        responses={200: UserSerializer}
    )
    def get(self, request, format=None):
        user = request.user
        serializer = UserProfileSerializer(user)
        return JsonResponse(serializer.data, safe=False, status=200)
        
    @login_required_view
    @swagger_auto_schema(
        operation_id='update_profile_data',
        operation_description='Update current user data',
        responses={200: UserSerializer}
    )
    def patch(self, request, offer_id, format=None):
        data = JSONParser().parse(request)

        if serializer.is_valid():
            user = request.user
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.email = data.get('email', user.email)
            user.save()
            serializer = UserProfileSerializer(user)
            return JsonResponse(serializer.data, status=201)
        else:
            return JsonResponse(serializer.errors, safe=False, status=400)
    