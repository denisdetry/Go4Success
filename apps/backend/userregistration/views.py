from django.shortcuts import render

from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
import re
from .serializers import *


def check_isSha256(string):
    """
    check if a string has the sha256

    parameters
    ----------

    string : is a string that handle a sha256 (str)

    return 
    ------
    true if the string is a sha256

    """
    pattern = re.compile(r'^[a-fA-F0-9]{64}$')
    return bool(pattern.match(string))


class UserRegistration(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()

    serializer_class = UserSerializer


@api_view(['POST'])
def register_user(request):
    """
    allows to register a user

    parameters
    ----------
    request : it's the request from the backend (JSON)

    return 
    ------
    Response : it's the response to the backend

    """
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid() and check_isSha256(request.data.get('password')):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
