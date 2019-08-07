from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from travel_monitor.settings import DEAMON_LOGIN, DEAMON_PASSWORD
from django.core.exceptions import ObjectDoesNotExist

class Command(BaseCommand):
    help = 'Commands that should be run before running travel_monitor application. It setups it and add required data to database'

    def handle(self, *args, **kwargs):
        self.create_webscraper_deamon_user()
       
    def create_webscraper_deamon_user(self):
        webscraper_deamon_user = None
        try:
            webscraper_deamon_user = User.objects.get(username=DEAMON_LOGIN)
            self.stdout.write('UPDATE user for Webscraper deamon')
        except ObjectDoesNotExist:
            self.stdout.write('CREATE user for Webscraper deamon')
            webscraper_deamon_user = User()
        webscraper_deamon_user.username = DEAMON_LOGIN
        webscraper_deamon_user.set_password(DEAMON_PASSWORD)
        webscraper_deamon_user.email = 'satan666@gmail.com'
        webscraper_deamon_user.save() 