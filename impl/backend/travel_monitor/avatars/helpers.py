from datetime import timedelta
import base64
from django.db import models
from django.core.files.base import ContentFile
from django.http.response import JsonResponse
from django.core.files.storage import FileSystemStorage
import os
from PIL import Image
import uuid
import base64

class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        self.delete(name)
        return name

def base64_file_decode(data, name=None):
    _format, _img_str = data.split(';base64,')
    _name, ext = _format.split('/')
    if not name:
        name = _name.split(":")[-1]
    return ContentFile(base64.b64decode(_img_str), name='{}.{}'.format(name, ext))

def createImageFromRequestParam(paramValue):
  if paramValue != None and paramValue != '':
    return ContentFile(base64.standard_b64decode(paramValue), str(uuid.uuid4())[:12] + '.jpg')
  else:
    raise Exception("No value")

def createImageFromRequesyBody(body, path):
  if body != None and body != '':
    if path != None:
      file_name = os.path.basename(path)
      return ContentFile(body, file_name)
    else: 
      return ContentFile(body, str(uuid.uuid4())[:12] + '.jpg')
  else:
    raise Exception("No value")

def saveImage(imageHeight, imageWidth, imageField: models.ImageField):
    image = Image.open(imageField)
    image = image.convert('RGB')
    size = (imageWidth, imageHeight)
    image.thumbnail(size, Image.ANTIALIAS)
    image.save(imageField.path)
    return