from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserRegistration

router = DefaultRouter()

router.register(r'', UserRegistration)

urlpatterns = [
    path('', include(router.urls)),
]
