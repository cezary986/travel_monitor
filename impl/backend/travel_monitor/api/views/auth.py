from django.http import HttpResponse
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
import json
import django
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
from rest_framework import generics
from django.contrib.auth.models import User
from api.decorators import login_required, require_http_methods, login_required_view
from travel_monitor.settings import TOKEN_LIFE_TIME
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from api.serializers import MessageSerializer, LoginCheckSerializer
from api.utils import Message
from rest_framework.renderers import JSONRenderer

class LoginView(APIView): 

    @swagger_auto_schema(
        operation_id='login',
        operation_description='Login to system with given username and password passed in json body',
        responses={200: MessageSerializer, 401: 'When credentials were incorrect'}
    )
    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            username = body['username']
            password = body['password']
        except KeyError:
            serializer = MessageSerializer(Message('No username or password field'))
            return HttpResponseBadRequest(JSONRenderer().render(serializer.data))

        user = auth.authenticate(request, username=username, password=password)
        if user is not None:
            request.session.set_expiry(TOKEN_LIFE_TIME)
            auth.login(request, user)
            serializer = MessageSerializer(Message('No username or password field'))
            return JsonResponse(serializer.data, status=200)
        else:
            serializer = MessageSerializer(Message('Invalid login or password'))
            return JsonResponse(serializer.data, status=401)

class LogoutView(APIView):

    @swagger_auto_schema(
        operation_id='logout',
        operation_description='Logout from the system',
        responses={200: MessageSerializer(Message('Logged out'))}
    )
    def post(self, request):
        auth.logout(request)
        serializer = MessageSerializer(Message('Logged out'))
        return JsonResponse(serializer.data, status=200)

class LoginCheck(APIView):

    @swagger_auto_schema(
        operation_id='check_login_status',
        operation_description='Simple endpoint to check if user is logged in.',
        responses={200: LoginCheckSerializer({ 'logged_in': True})}
    )
    def get(self, request):  
        serializer = LoginCheckSerializer({ 'logged_in': request.user.is_authenticated})
        return JsonResponse(serializer.data, status=200) 