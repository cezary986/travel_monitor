from django.urls import path

from api.views.system import VersionView, SupportedDomainsView
from api.views.auth import LoginView, LogoutView, LoginCheck, PasswordChange
from api.views.travel import TravelsListView, TravelDetailView, TravelUsersView
from api.views.offer import OffersListView, OfferDetailView, OffersArchivedListView
from api.views.offer_comment import OfferCommentsListView, OfferCommentDetailView
from api.views.price import PricesListView
from api.views.user import ProfileView, UsersListView
from avatars.views import AvatarView
from notifications.views import NotificationsListView, NotificationDetailView, NotificationFilterView

from rest_framework import status

from django.conf.urls import url
from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet
from api.signals_receivers import connect_receivers

urlpatterns = [
    path('version', VersionView.as_view(), name='version'),

    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('auth/check_login', LoginCheck.as_view(), name='check_login'),
    path('auth/password', PasswordChange.as_view(), name='change_password'),
    
    path('user', UsersListView.as_view(), name='users'),
    path('user/profile', ProfileView.as_view(), name='profile'),
    path('user/avatar', AvatarView.as_view(), name='avatar'),
    
    path('travels', TravelsListView.as_view(), name='travels'),
    path('travels/<int:travel_id>', TravelDetailView.as_view(), name='travel_detail'),
    path('travels/<int:travel_id>/users', TravelUsersView.as_view(), name='travel_users'),
    
    path('travels/<int:travel_id>/offers', OffersListView.as_view(), name='offers'),
    path('travels/<int:travel_id>/offers/archived', OffersArchivedListView.as_view(), name='offers_archived'),
    path('offers/<int:offer_id>', OfferDetailView.as_view(), name='offers'),
    
    path('offers/<int:offer_id>/prices', PricesListView.as_view(), name='prices'),
    
    path('offers/<int:offer_id>/comments', OfferCommentsListView.as_view(), name='offer_comments'),
    path('offers/comments/<int:comment_id>', OfferCommentDetailView.as_view(), name='offer_comment'),
    
    path('notifications', NotificationsListView.as_view(), name='notifications'),
    path('notifications/<int:notification_id>', NotificationDetailView.as_view(), name='notification'),
    path('notifications/filter', NotificationFilterView.as_view(), name='notification_filter'),
    path('notifications/types', NotificationFilterView.as_view(), name='notification_filter'),
    
    path('supported_domains', SupportedDomainsView.as_view(), name='supported_domains'),
]

connect_receivers()