from django.db import models
from avatars.helpers import OverwriteStorage
from django.contrib.auth.models import User

class Avatar(models.Model):
    image = models.ImageField(storage=OverwriteStorage(), upload_to="avatars/")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    class Meta:
        app_label = 'avatars'