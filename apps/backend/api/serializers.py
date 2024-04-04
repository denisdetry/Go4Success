from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Room, Activity, Attend, Course, User, Site


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, clean_data):
        user_obj = User.objects.create_user(**clean_data)
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = "__all__"

    def check_user(self, clean_data):
        user = authenticate(**clean_data)
        if not user:
            raise ValidationError("User not found")
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'noma')

    def validate_noma(self, value):
        if len(value) != 8 and len(value) != 0:
            raise ValidationError("Le noma doit contenir 8 caractères")
        return value


class RegisterToActivityserializer(serializers.ModelSerializer):
    class Meta:
        model = Attend
        fields = ('activity', 'student')


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'site')


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'name')


class ActivitySerializer(serializers.ModelSerializer):
    # Utilisation d'un SerializerMethodField pour personnaliser la représentation du champ activity_room
    room = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()
    date_start = serializers.DateTimeField(format="%d-%m-%Y - %H:%M")
    date_end = serializers.DateTimeField(format="%d-%m-%Y - %H:%M")

    class Meta:
        model = Activity
        fields = ('id', 'type', 'name', 'description', 'date_start',
                  'date_end', 'room', 'course')

    # Méthode pour personnaliser la représentation du champ activity_room
    def get_room(self, obj):
        if obj.room:
            return f"{obj.room.name} - {obj.room.site.name}"
        return

    def get_course(self, obj):
        if obj.course:
            return f"{obj.course.code} - {obj.course.name}"
        return


class AttendSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer(read_only=True)

    class Meta:
        model = Attend
        fields = ('activity', 'student')


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'name']
