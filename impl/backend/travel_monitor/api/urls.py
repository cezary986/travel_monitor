from django.urls import path

from . import views

urlpatterns = [
    path('version', views.version, name='version'),

    path('auth/login', views.login, name='login'),
    path('auth/logout', views.logout, name='logout'),
    path('auth/check_login', views.check_login, name='check_login'),
    
    path('travels', views.TravelsListView.as_view(), name='travels'),
    path('travel/<int:travel_id>', views.TravelDetailView.as_view(), name='travel'),
    path('travels/<int:travel_id>/offers', views.OffersListView.as_view(), name='offers'),
    path('offers/<int:offer_id>/prices', views.PricesListView.as_view(), name='prices'),
]