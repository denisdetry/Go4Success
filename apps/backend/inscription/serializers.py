from rest_framework import serializers
from models import *


class UserCreationSerializer(serializers.Serializer):
    Email = serializers.CharField(required=True)
    Name = serializers.CharField(required=True, allow_blank=True, max_length=100)
    FirstName = serializers.CharField(required=True)
    Password = serializers.CharField(required=True)

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return models.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.Email = validated_data.get('Email',instance.Email)
        instance.Name = validated_data.get('Name',instance.Name)
        instance.FirstName = validated_data.get('FirstName',instance.FirstName)
        instance.Password = validated_data.get('Password',instance.Password)

        instance.save()
        return instance