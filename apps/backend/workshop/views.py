from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import permissions, viewsets

from .serializers import *

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = ROOM.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = COURSE.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]



class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = ACTIVITY.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]    