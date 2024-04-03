from django.contrib.auth import authenticate
from api.models import Teacher, User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name',
                  'is_superuser']


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['is_tutor', 'is_professor']


class EditRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['user', 'is_professor', 'is_tutor']
