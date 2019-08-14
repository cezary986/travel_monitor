from django.apps import AppConfig
from api.signals_receivers import connect_receivers

class ApiConfig(AppConfig):
    name = 'api'
    
    def ready(self):
        connect_receivers()
        