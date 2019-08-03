from django.db import models
from django.contrib.auth.models import User
from travel_monitor.data_providers import DATA_PROVIDERS_LABELS

class Tag(models.Model):
    text = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        app_label = 'api'

    def to_json(self):
        return self.text

class Price(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    value =  models.IntegerField()
    offer = models.ForeignKey('Offer', related_name='offer', on_delete=models.CASCADE)

    class Meta:
        app_label = 'api'

    def to_json(self):
        return {
            'value': self.value,
            'timestamp': self.timestamp,
        }

class Offer(models.Model):
    title = models.CharField(max_length=200, null=True)
    url = models.CharField(max_length=600, null=False)
    photo_url = models.CharField(max_length=600, null=True)
    current_price = models.ForeignKey('Price', related_name='current_price', null=True, on_delete=models.SET_NULL)
    travel = models.ForeignKey('Travel', on_delete=models.CASCADE, null=True)
    data_provider = models.CharField(max_length=30, choices=DATA_PROVIDERS_LABELS)

    class Meta:
        app_label = 'api'

    def to_json(self):
        json = {
            'id': self.id,
            'title': self.title,
            'url': self.url,
            'photo_url': self.photo_url,
            'data_provider': self.data_provider
        }
        if self.current_price != None:
            json['current_price'] = self.current_price.to_json()
        else:
            json['current_price'] = None
        return json

class Travel(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True)
    refreshed = models.DateTimeField(null=True)
    title = models.CharField(max_length=200, null=False)
    tags = models.ManyToManyField('Tag', related_name='tags')
    best_offer = models.ForeignKey('Offer', related_name='best_offer', null=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = 'api'

    def to_json(self):
        json =  {
            'id': self.id,
            'title': self.title,
            'offers': [
                offer.to_json() for offer in Offer.objects.filter(travel=self)
            ],
            'created': self.created,
            'created_by': self.created,
            'refreshed': self.refreshed,
        }
        if self.best_offer != None:
            json['best_offer'] = self.best_offer.to_json()
        else:
            json['best_offer'] = None
        return json
