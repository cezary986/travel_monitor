from rest_framework.views import APIView

class Message(object):
    def __init__(self, message):
        self.message = message