from rest_framework import serializers
from .models import *

class Go4SuccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Go4Success
        fields = ('id', 'name', 'email', 'phone', 'message')
        