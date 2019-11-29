"""
Django settings for travel_monitor project.

Generated by 'django-admin startproject' using Django 2.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
from . import disable_csrf

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

USE_TZ = True
TIME_ZONE = 'Europe/Warsaw'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'g&pl*opyg*kxrw+_4)2c2ku#illago-tmgsmj)30o-!f*poez_'

TOKEN_LIFE_TIME = 2 * 7 * 24 * 60 * 60

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'channels',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
    'rest_framework',
    'drf_yasg',
    "fcm_django",
    "avatars",
    "notifications",
    'guardian',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'travel_monitor.disable_csrf.DisableCSRF'
]

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend', # this is default
    'guardian.backends.ObjectPermissionBackend',
)

ROOT_URLCONF = 'travel_monitor.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'travel_monitor.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'travel_monitor',                      
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

USE_I18N = True

USE_L10N = True



# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

# Channels
ASGI_APPLICATION = 'travel_monitor.routing.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,
}

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'basic': {
            'type': 'basic'
        }
    },
}

REDOC_SETTINGS = {
   'LAZY_RENDERING': False,
}

PORT = 8080

DEAMON_LOGIN = '2qDS2pcka9Fu5V4o'
DEAMON_PASSWORD = "1117b2d3ae63ace3a7133a3730ab4795"


FCM_DJANGO_SETTINGS = {
        "APP_VERBOSE_NAME": "[string for AppConfig's verbose_name]",
         # default: _('FCM Django')
        "FCM_SERVER_KEY": "[your api key]",
         # true if you want to have only one active device per registered user at a time
         # default: False
        "ONE_DEVICE_PER_USER": True,
         # devices to which notifications cannot be sent,
         # are deleted upon receiving error response from FCM
         # default: False
        "DELETE_INACTIVE_DEVICES": False,
}

MEDIA_ROOT = os.path.join(BASE_DIR, 'images')
MEDIA_URL = '/images/'

STATIC_ROOT = os.path.join(BASE_DIR, 'www', 'static', 'images')
STATIC_URL = '/static/'
# Extra places for collectstatic to find static files.
STATICFILES_DIRS = [
  os.path.join(BASE_DIR, 'backend', 'static')
]


# <AVATARS>
AVATAR_SIZE = 100
# </AVATARS>

# <NOTIFICATIONS>
EVENTS = [
    {
        'name': 'travel_create',
        'title': 'Utworzenie podróży',
        'description': None,
    },
    {
        'name': 'travel_delete',
        'title': 'Usunięcie podróży',
    },
    {
        'name': 'offer_elapse',
        'title': 'Wygaśnięcie oferty',
    },
    {
        'name': 'offer_create',
        'title': 'Utworzenie oferty',
    },
    {
        'name': 'offer_delete',
        'title': 'Usunięcie oferty',
    },
    {
        'name': 'test',
        'title': 'Testowe powiadomienia',
    },
]

EVENT_TYPES = []

for el in EVENTS:
    EVENT_TYPES.append((el['name'], el['name']))
# </NOTIFICATIONS>