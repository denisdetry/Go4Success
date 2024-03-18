from api.models import *
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['password', 'id', 'username',
                  'email', 'first_name', 'last_name']