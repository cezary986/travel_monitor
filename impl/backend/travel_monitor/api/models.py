from django.db import models
from django.contrib.auth.models import User
from travel_monitor.data_providers import DATA_PROVIDERS_LABELS
from api.helpers import OverwriteStorage

class Avatar(models.Model):
    image = models.ImageField(storage=OverwriteStorage(), upload_to="avatars/")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    class Meta:
        app_label = 'api'

class OfferComment(models.Model):
    timestamp = models.DateTimeField(auto_now_add=False)
    edited = models.DateTimeField(null=True)
    content = models.TextField(max_length=2000, null=False)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    offer = models.ForeignKey('Offer', on_delete=models.CASCADE, null=False)
    parent = models.ForeignKey('OfferComment', on_delete=models.CASCADE, null=True)

    class Meta:
        app_label = 'api'

class Notification(models.Model):
    timestamp = models.DateTimeField(auto_now_add=False)
    title = models.CharField(max_length=100, null=False)
    message = models.CharField(max_length=300, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    
    class Meta:
        app_label = 'api'

class Tag(models.Model):
    text = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        app_label = 'api'

class Price(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    value =  models.IntegerField()
    offer = models.ForeignKey('Offer', related_name='offer', on_delete=models.CASCADE)

    class Meta:
        app_label = 'api'

class Offer(models.Model):
    title = models.CharField(max_length=200, null=True)
    created = models.DateTimeField(auto_now_add=True)
    url = models.CharField(max_length=600, null=False)
    photo_url = models.CharField(max_length=600, null=True)
    last_price = models.ForeignKey('Price', related_name='last_price', null=True, on_delete=models.SET_NULL)
    current_price = models.ForeignKey('Price', related_name='current_price', null=True, on_delete=models.SET_NULL)
    travel = models.ForeignKey('Travel', on_delete=models.CASCADE, null=True)
    data_provider = models.CharField(max_length=30, choices=DATA_PROVIDERS_LABELS)
    date_from = models.DateTimeField(null=True)
    date_to = models.DateTimeField(null=True)
    error = models.CharField(max_length=200, null=True)
    
    class Meta:
        app_label = 'api'

class Travel(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True)
    refreshed = models.DateTimeField(null=True)
    title = models.CharField(max_length=200, null=False)
    tags = models.ManyToManyField('Tag', related_name='tags')
    best_offer = models.ForeignKey('Offer', related_name='best_offer', null=True, on_delete=models.SET_NULL)

    class Meta:
        app_label = 'api'
