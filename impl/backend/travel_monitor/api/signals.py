import django

travel_create = django.dispatch.Signal(providing_args=["user", "travel"])
travel_delete = django.dispatch.Signal(providing_args=["user", "travel"])

offer_elapse = django.dispatch.Signal(providing_args=["offer"])
offer_create = django.dispatch.Signal(providing_args=["user", "offer"])
offer_delete = django.dispatch.Signal(providing_args=["user", "offer"])
test = django.dispatch.Signal()