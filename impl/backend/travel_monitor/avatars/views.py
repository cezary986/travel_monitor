import django
import os
from PIL import Image
import base64
from django.core import exceptions
from django.core.files.base import ContentFile
from django.http import QueryDict
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ObjectDoesNotExist
from django.core import exceptions
from django.http.response import HttpResponse
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.parsers import JSONParser
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema
from avatars.models import Avatar
from avatars.decorators import login_required_view
from avatars.helpers import saveImage, createImageFromRequesyBody
from avatars.serializers import MessageSerializer, AvatarSerializer
from avatars.utils import Message
from django.conf import settings

DEFAULT_AVATAR_SIZE = 100 #px 
AVATAR_SIZE = getattr(settings, "AVATAR_SIZE", 100)

class AvatarView(APIView):

    @login_required_view
    @swagger_auto_schema(
        operation_id='get_user_avatar_data',
        operation_description='Get current user avatar data',
        responses={200: AvatarSerializer}
    )
    def get(self, request, format=None):
        avatar_data = None
        try:
            avatar_data = Avatar.objects.get(user=request.user)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('User has no avatar'))
            return JsonResponse(serializer.data, status=404)
        serializer = AvatarSerializer(
            avatar_data, many=False)
        return JsonResponse(serializer.data, status=200)

    @login_required_view
    @swagger_auto_schema(
        operation_id='set_user_avatar',
        operation_description='Set current user avatar image',
        responses={200: AvatarSerializer}
    )
    def post(self, request, format=None):
        avatar_data = None
        override = True
        try:
            avatar_data = Avatar.objects.get(user=request.user)
        except ObjectDoesNotExist:
            override = False
            avatar_data = Avatar(user=request.user)
        if override:
            # Overwrite existing avatar
            avatar_data.image = createImageFromRequesyBody(
            request.body, avatar_data.image.path)
        else:
            avatar_data.image = createImageFromRequesyBody(request.body, None)
        try:
            avatar_data.save()
            saveImage(AVATAR_SIZE, AVATAR_SIZE, avatar_data.image)
            serializer = AvatarSerializer(avatar_data,)
            return JsonResponse(serializer.data, status=200)
        except Exception as error:
            serializer = MessageSerializer(Message('Error saving avatar'))
            return JsonResponse(serializer.data, status=401)
