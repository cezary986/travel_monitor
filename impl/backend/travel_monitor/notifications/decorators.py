from django.http.response import HttpResponseForbidden
from functools import wraps

def login_required_view(func):
    """
    Decorator for throwing an 403 error when user is not logged in
    """
    def wrapper(self, request, *args, **kwargs):
        if not request.user.is_authenticated:            
            return HttpResponseForbidden("You must be logged in")
        else:
            return func(self, request, *args, **kwargs)
        
    return wrapper
