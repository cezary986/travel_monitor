"""travel_monitor URL Configuration
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url

from django.contrib import admin
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from travel_monitor import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
   openapi.Info(
      title="Travel Monitor API",
      default_version='v1',
      description="App for monitoring travel offers from different websites",
      contact=openapi.Contact(email="cezary.maszczyk@gmail.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Documentation
    url(r'^doc/swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^doc/swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^doc/redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
