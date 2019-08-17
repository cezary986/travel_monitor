from django.urls import path

from api.views.system import VersionView, SupportedDomainsView, NotificationsView
from api.views.auth import LoginView, LogoutView, LoginCheck
from api.views.travel import TravelsListView, TravelDetailView
from api.views.offer import OffersListView, OfferDetailView
from api.views.offer_comment import OfferCommentsListView, OfferCommentDetailView
from api.views.price import PricesListView
from api.views.user import ProfileView
from api.views.avatar import AvatarView

from drf_yasg.utils import swagger_auto_schema
from rest_framework import status

urlpatterns = [
    path('version', VersionView.as_view(), name='version'),

    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/check_login', LoginCheck.as_view(), name='check_login'),
    
    path('user/profile', ProfileView.as_view(), name='profile'),
    path('user/avatar', AvatarView.as_view(), name='avatar'),
    
    path('travels', TravelsListView.as_view(), name='travels'),
    path('travels/<int:travel_id>', TravelDetailView.as_view(), name='travel_detail'),
    
    path('travels/<int:travel_id>/offers', OffersListView.as_view(), name='offers'),
    path('offers/<int:offer_id>', OfferDetailView.as_view(), name='offers'),
    
    path('offers/<int:offer_id>/prices', PricesListView.as_view(), name='prices'),
    
    path('offers/<int:offer_id>/comments', OfferCommentsListView.as_view(), name='offer_comments'),
    path('offers/comments/<int:comment_id>', OfferCommentDetailView.as_view(), name='offer_comment'),
    
    path('supported_domains', SupportedDomainsView.as_view(), name='supported_domains'),
    path('notifications', NotificationsView.as_view(), name='notifications'),
]