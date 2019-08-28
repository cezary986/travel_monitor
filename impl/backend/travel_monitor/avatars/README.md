
# Django REST Avatars

@author Cezary Maszczyk cezary.maszczyk@gmail.com

Application providing clear REST API for managing user avatars

## Instalation

All required packages are specified in ```requirements.txt``` file. You can install them with one command:

```bash
pip install -r ./requirements.txt
```

Then in your ```settings.py``` add ```avatars``` to your INSTALLED_APPS:

```python
INSTALLED_APPS = [
    ...
    "avatars"
]
```

Configure static media serving in your ```settings.py```. Below is a example configuration:

```python
MEDIA_ROOT = os.path.join(BASE_DIR, 'images')
MEDIA_URL = '/images/'

STATIC_ROOT = os.path.join(BASE_DIR, 'www', 'static', 'images')
STATIC_URL = '/static/'

STATICFILES_DIRS = [
  os.path.join(BASE_DIR, 'backend', 'static')
]
```

Optionally in your ```settings.py``` file specify avatar image size to which all uploaded images will be trimmed. Default size is 100px. All avatars are cropped to squares proportions.

```python
AVATAR_SIZE = 60 # px
```

### Configuring API urls

Avatars app provides you some endpoint to set ans get user avatars. You can add them to your ```urls.py``` file. Example configuration is bellow:

```python
from django.urls import path

from avatars.views import AvatarView

urlpatterns = [
    ...
    '''
    GET - get current user avatar object
    POST - set image
    '''
    path('user/avatar', AvatarView.as_view(), name='avatar'),
]
```

## Adding avatar field to your User serializer

Avatars are stored as different models and even though are binded with users are not part of user objects. If you want to serialize avatar as if it was a user object field just inherit your user serializer from ```avatars.serializers.UserSerializer```.

```python

from avatars.serializers import UserSerializer as AvatarUserSerializer

class UserSerializer(AvatarUserSerializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=200, read_only=True)
    email = serializers.EmailField(max_length=400, read_only=True)
    first_name = serializers.CharField(max_length=200, read_only=True)
    last_name = serializers.CharField(max_length=200, read_only=True)

````

Now when you serialize User object an avatar field will be injected to it. Result may look like this:

```json
{
    "id": 1, 
    "username": "JohnDoe", 
    "email": "john.doe@gmail.com", 
    "first_name": "John", 
    "last_name": "Doe", 
    "avatar": {
        "image": "/images/avatars/a3f42765-93b.jpg"
    }
}
```
To get the image hit:

http://your-crazy-domain```/images/avatars/a3f42765-93b.jpg```

If you are developing and running local Django server on port lets say 8080 your will be here:

http://localhost:8080```/images/avatars/a3f42765-93b.jpg```
