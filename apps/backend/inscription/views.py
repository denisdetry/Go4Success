from .serializers import *
from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .validations import custom_validation, validate_username, validate_password
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import viewsets
from .models import *
from inscription.serializers import UserCreationSerializer



@APIView(['GET','POST'])
def userCreation(request):
    """
    List all code snippets, or create a new snippet.
    """
    if request.method == 'GET':
        snippets = models.objects.all()
        serializer = UserCreationSerializer(snippets, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

