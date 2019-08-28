from api.models import  Offer, OfferComment
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
from api.serializers import OfferCommentSerializer, OfferCommentWithResponsesSerializer, MessageSerializer
from api.utils import Message
from datetime import datetime
from rest_framework.pagination import LimitOffsetPagination
from api.schema import OfferCommentsListReponse

class OfferCommentsListView(APIView):
  
    @swagger_auto_schema(
      operation_id='list_all_offer_comments',
      operation_description='Return all offer comments',
      responses={200: OfferCommentsListReponse, 404: 'If no travel with given id exist or travel has no comments'}
    )
    @login_required_view
    def get(self, request, offer_id, format=None):
        offer = None
        try:
            offer = Offer.objects.get(pk=offer_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No offer with given id exist'))
            return JsonResponse(serializer.data, status=404)
        try:
            # pick only comments that aren't reponses to other comments - they will serialize their reposnses
            top_level_comments = OfferComment.objects.filter(offer=offer, parent=None).order_by('-timestamp')
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No comments for this travel'))
            return JsonResponse(serializer.data, status=404)
        return self._make_paginated_response(top_level_comments)
    
    def _make_paginated_response(self, queryset):
        paginator = LimitOffsetPagination()
        queryset = paginator.paginate_queryset(queryset, self.request)
        serializer = OfferCommentWithResponsesSerializer(queryset, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
      operation_id='add_comment_to_offer',
      operation_description='Adds comment to offer',
      responses={200: OfferCommentSerializer, 400: 'For corrupted body'}
    )
    @login_required_view
    def post(self, request, offer_id, format=None):
        offer = None
        try:
            offer = Offer.objects.get(pk=offer_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No offer with given id exist'))
            return JsonResponse(serializer.data, status=404)
        data = JSONParser().parse(request)
        serializer = OfferCommentSerializer(data=data)
        if serializer.is_valid():
            model = serializer.save()
            model.offer = offer
            model.save()
            return JsonResponse(serializer.data, status=201)
        
        return JsonResponse(serializer.errors, status=400)

class OfferCommentDetailView(APIView):

    @login_required_view
    @swagger_auto_schema(
        operation_id='delete_offer_commnet',
        operation_description="Delete offer's commnet",
        responses={200: '{"message": "Comment deleted"}'}
    )
    def delete(self, request, comment_id, format=None):
        comment = None
        try:
            comment = OfferComment.objects.get(pk=comment_id)
        except ObjectDoesNotExist:
            serializer = MessageSerializer(Message('No comment with given id exist'))
            return JsonResponse(serializer.data, status=404)
        comment.delete()
        serializer = MessageSerializer(Message('Comment deleted'))
        return JsonResponse(serializer.data, safe=False, status=200)
        
    @login_required_view
    @swagger_auto_schema(
        operation_id='update_offer_comment',
        operation_description="Update offer's comment's content",
        responses={200: ''}
    )
    def patch(self, request, comment_id, format=None):
        data = JSONParser().parse(request)
        serializer = OfferCommentSerializer(data=data, partial=True)
        comment = None
        if serializer.is_valid():
            try:
                comment = OfferCommentSerializer.objects.get(pk=comment_id)
            except ObjectDoesNotExist:
                serializer = MessageSerializer(Message('No comment with given id exist'))
                return JsonResponse(serializer.data, status=404)
            comment.content = data.get('content', comment.content)
            comment.edited = datetime.now()
            serializer = OfferCommentSerializer(comment)
            return JsonResponse(serializer.data, status=201)
        else:
            return JsonResponse(serializer.errors, safe=False, status=400)