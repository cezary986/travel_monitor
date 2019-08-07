from django.urls import path

from . import views
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status

urlpatterns = [
    path('version', views.VersionView.as_view(), name='version'),

    path('auth/login', views.LoginView.as_view(), name='login'),
    path('auth/logout', views.LogoutView.as_view(), name='logout'),
    path('auth/check_login', views.LoginCheck.as_view(), name='check_login'),
    
    path('travels', views.TravelsListView.as_view(), name='travels'),
    path('travel/<int:travel_id>', views.TravelDetailView.as_view(), name='travel_detail'),
    path('travels/<int:travel_id>/offers', views.OffersListView.as_view(), name='offers'),
    path('offers/<int:offer_id>/prices', views.PricesListView.as_view(), name='prices'),
    path('supported_domains', views.SupportedDomainsView.as_view(), name='supported_domains'),
]