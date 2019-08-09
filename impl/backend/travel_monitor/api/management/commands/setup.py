from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from travel_monitor.settings import DEAMON_LOGIN, DEAMON_PASSWORD
from django.core.exceptions import ObjectDoesNotExist
import os

DEFAULT_USER_USERNAME = 'admin'
DEFAULT_USER_PASSWORD = 'admin'

class Command(BaseCommand):
    help = 'Commands that should be run before running travel_monitor application. It setups it and add required data to database'

    def handle(self, *args, **kwargs):
        self.migrate_db()
        self.create_webscraper_deamon_user()
        self.create_default_user()

    def migrate_db(self):
        os.system('python manage.py makemigrations')
        os.system('python manage.py makemigrations api')
        os.system('python manage.py migrate')
        os.system('python manage.py migrate api')
       
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

    def create_default_user(self):
        user = None
        try:
            user = User.objects.get(username=DEFAULT_USER_USERNAME)
            self.stdout.write('UPDATE default user')
        except ObjectDoesNotExist:
            self.stdout.write('CREATE default user')
            user = User(username=DEFAULT_USER_USERNAME)
        user.set_password(DEFAULT_USER_PASSWORD)
        user.is_superuser = True
        user.is_staff = True
        user.save()