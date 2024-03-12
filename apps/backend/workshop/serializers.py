from api.models import *
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_active']


class RoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ROOM
        fields = ['site_name', 'room_name']


class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = COURSE
        fields = ['course_code']


class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ACTIVITY
        fields = '__all__'
