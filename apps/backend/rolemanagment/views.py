from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from api.models import User
from .serializers import UserSerializer


class UserView(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    queryset = User.objects.all()

    serializer_class = UserSerializer


@api_view(['GET', 'POST'])
def role(request):
    if request.method == 'GET':
        data = User.objects.all()
        serializer = UserSerializer(data, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
