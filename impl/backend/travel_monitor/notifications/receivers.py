from django.apps import AppConfig
from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.conf import settings
from notifications.models import EventType, NotificationsFilter
from django.core.exceptions import ObjectDoesNotExist

db_updated = False

def add_events_types_to_db(sender, **kwargs):
    global db_updated
    if db_updated == True:
        return
    else:
        db_updated = True
    for event_type in settings.EVENTS:
        model = None
        try:
            model = EventType.objects.get(name=event_type['name'])
            print(model.name)
        except ObjectDoesNotExist:
            model = None
        if model == None:
            model = EventType.objects.create(
                name=event_type['name'],
                title=event_type['title'],
                description=event_type.get('description', None)
            )
            filters = NotificationsFilter.objects.all()
            for filter in filters:
                filter.types_enabled.add(model)
        else:
            if model.name != event_type['name']:
                model.name = event_type['name']
            if model.title != event_type['title']:
                model.title = event_type['title'],
            model.description = event_type.get('description', None)
        model.save()


def connect_receivers():
    post_migrate.connect(add_events_types_to_db, sender=None)
