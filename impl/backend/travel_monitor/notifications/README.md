
# Django REST Notifications

@author Cezary Maszczyk cezary.maszczyk@gmail.com

Application providing clear REST and Websockets API for managing user notifications

## Instalation

All required packages are specified in ```requirements.txt``` file. You can install them with one command:

```bash
pip install -r ./requirements.txt
```

Then in your ```settings.py``` add ```notifications``` to your INSTALLED_APPS:

```python
INSTALLED_APPS = [
    ...
    "notifications"
]
```
Then in the same file configure paging:

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,
}
```
For now application only supports ```LimitOffsetPagination``` pagination. It takes two url params:
* ```limit``` - page size
* ```offset``` - offset from which to start. For example for offset = 20. 20 first records will be skipped.

If you want to user websockets for real time notifications configure ws routing in ```routing.py``` file (same level as ```settings.py```). It will look like this:


```python
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.routing import ProtocolTypeRouter

import notifications.routing

application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': AuthMiddlewareStack(
        URLRouter(
            notifications.routes.websocket_urlpatterns
        )
    )
})
```
Or if you already use Channels in your app you may do it like this:
```python
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.routing import ProtocolTypeRouter

import notifications.routing
import api.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            # your app's channels routing
            api.routing.websocket_urlpatterns +
            notifications.routes.websocket_urlpatterns
        )
    )
})
```

### Configuring API urls

Notifications app provides you also with simple HTTP endpoint to get all users notifications, delete them and mark them as readed. To use it modify your ```urls.py``` file. Example configuration is bellow:

```python
from django.urls import path

from notifications.views import NotificationsListView, NotificationDetailView, NotificationFilterView

urlpatterns = [
    ...
    '''
    GET - get all user's notifications 
        params:
            - readed - filter by readed field. Supported values are 'true', 'false' or valid timestamp string in format 'YYYY-MM-DDTHH:MM:SS'
    PATCH - batch marking as readed (body must contain array of notifications id's)
    '''
    path('notifications', NotificationsListView.as_view(), name='notifications'),
    '''
    DELETE - delete notification by id
    PATCH - mark notification as readed (no need to send anything in request body)
    '''
    path('notifications<int:notification_id>', NotificationDetailView.as_view(), name='notification'),
    '''
    GET - gets user notifications filter (default is all evnet's types enabled)
    PATCH - updated user notifications filter
    '''
    path('notifications/filter', NotificationFilterView.as_view(), name='notification_filter'),
    
]
```

## Sending notifications

First before you create and send any notification you  must understand the main concept of ```Events``` and ```Notifications``` used here. ```Event``` is some kind of occurrence in your system like writing a comment under someone's post. When somebody writes a comment there is like one event in a system. This event can however results in many notifications for example for every user observing this post. So ```Notification``` is kind of a message about event occuring in the system. Message which is dedicated to the specific user.

Every ```Event``` must have a type which you need to declare at the beggining. Types can be for example:
* post like
* post comment
* become friends request
* friends birthday

You should declare them in your ```settings.py``` file, like this (don't change variables names: EVENTS and EVENT_TYPES):

```python
EVENTS = [
    {
        'name': 'post_like',
        'title': 'Post liking',
        # description is optional you may give here a None as well
        'description': "Event triggered when someone like your post",
    },
    {
        'name': 'post_comment',
        'title': 'Post commenting',
        'description': "Event triggered when someone comment under your post",
    },
    {
        'name': 'become_friends_request',
        'title': "Become friends request",
        'description': "Event triggered when someone ask you to become his friend",
    },
]

EVENT_TYPES = []

# don't forget to do this - it creates choise object for models
for el in EVENTS:
    EVENT_TYPES.append((el['name'], el['name']))
```

Now to save your event's types in database run migrate command:

```bash
python manage.py migrate notifications
```

So now we declared which types of events are in our system. Now we can raise notifications about them!

You can easily send a notification with ```send_notification``` function

```python
from notifications.helpers import send_notification

# Somewhere in your code...

# These are mandatory
event_type = "new_mission" # make sure it is valid type declared before
title = "You have new mission!"

# These are optional
notification_data = MissionData(title="Mission Impossible")
audience = User.objects.filter(groups__name='secret_agents')
message = "Our country needs you! Here are your new mission details"

send_notifications(
    type=event_type, 
    title=title, 
    data=notification_data, 
    users=audience, 
    message=message)
```

If you skip ```users``` param notification will be send to all users (User.objects.all()) which might not be what you really want.

In data field you may pass litterally whatever you want (as long as its json serializable)

### User notifications filters

Filters may be useful for users to ignore notifications about specific event types. By default user receives every notification you send to him. By creating filter he specify all events types he wants to be notified about. There is special ViewSet and model for this in db so all you need is to import it into your urls (see ```Using API``` section)


## Using API

In your client of whatever choice you can gather user notifications by two ways:
 * by HTTP REST endpoint
 * by Websockets

REST API allows you to get all notifications that already exists in system while connecting to socket give you ability to receive real time notification the moment they are created.

Socket is available under following url:

ws://your-crazy-domain```/ws/notifications```

So if your are developing and using local Django server on port lets say 8080, it will be:

ws://localhost:8080```/ws/notifications```

General data format of notifications looks like this:

```js
{
    "id": number,
    "user": number, // user id
    "readed": "YYYY-MM-DDTHH:MM:SS" | null,
    "event": {
        "id": 1,
        "timestamp": "YYYY-MM-DDTHH:MM:SS",
        "author": number | null, // user id
        "type": {
            "id": number,
            "name": string,
            "title": string,
            "description": string | null
        },
        "title": string,
        "message": string,
        "data": Object | null
    }
}

```

Note: ```author```, ```message``` and ```data``` field may be null

Mind that sockets however does not serve notifications objects but they pack them in wrapping objects. So data served by sockets looks like this:

```js
{
    "action": "new" | "readed",
    "notification": Notification
}
```

```action``` field is telling you why you received notification:
* ```new``` - means that use received brand new notification
* ```readed``` - means that user marked notification as readed - for example from different device

REST API endpoint for getting list of all notifications also returns a kind of packaged response with paging:

```js
{
    "count": 20,
    "next": null, // link to next portion of data (page)
    "previous": null, // linkt to previou page
    "results": [
       {
            "id": number,
            "user": number, // user id
            "readed": "YYYY-MM-DDTHH:MM:SS" | null,
            "event": {
                "id": 1,
                "timestamp": "YYYY-MM-DDTHH:MM:SS",
                "author": number | null, // user id
                "type": {
                    "id": number,
                    "name": string,
                    "title": string,
                    "description": string | null
                },
                "title": string,
                "message": string,
                "data": Object | null
            }
        },
        ...
    ]
}
```

Reccomended way of using API is to get full list of notifications at the start of application and then connect to socket to receive new ones and update the list accordingly.