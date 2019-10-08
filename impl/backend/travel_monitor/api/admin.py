from django.contrib import admin
# Register your models here.from django.contrib import admin

from api.models import Offer, Travel, OfferComment

admin.site.register(Offer)
admin.site.register(Travel)
admin.site.register(OfferComment)
