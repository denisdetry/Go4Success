from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from .models import *

class UnregisterFromActivitySerializer(serializers.Serializer):
    
    class Meta:
        model = ATTENDS
        fields = ('activity', 'student')