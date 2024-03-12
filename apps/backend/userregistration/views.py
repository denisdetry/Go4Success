from django.shortcuts import render

from rest_framework import permissions, viewsets, status
from rest_framework.response import Response

from .serializers import *


class UserRegistration(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
