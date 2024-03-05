from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from .models import *

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        
    def create(self, clean_data):
        user_obj = User.objects.create_user(**clean_data)
        return user_obj
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def check_user(self, clean_data):
        user = authenticate(**clean_data)
        if not user:
            raise ValidationError("User not found")
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name') 
        
class registerToActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ATTENDS
        fields = ('activity', 'student')
        
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ACTIVITY
        fields = ('activity_id', 'activity_type', 'activity_name', 'activity_description','activity_date_start', 'activity_date_end', 'activity_room', 'activty_course_code')