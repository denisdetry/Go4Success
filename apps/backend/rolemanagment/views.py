from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from database.models import Teacher, User
from .serializers import UserSerializer, EditRoleSerializer
from rest_framework.generics import DestroyAPIView
from .permissions import IsSuperUser


class UserView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny, IsSuperUser,)

    serializer_class = UserSerializer

    queryset = User.objects.all()

    def get(self, request):
        data = User.objects.all()
        serializer = UserSerializer(data, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        instance = self.get_object(pk=pk)
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EditRoleView(viewsets.ModelViewSet, APIView):

    permission_classes = (permissions.AllowAny, IsSuperUser,)

    serializer_class = EditRoleSerializer

    queryset = Teacher.objects.all()

    def get(self, request):
        data = Teacher.objects.all()
        serializer = EditRoleSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EditRoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        instance = self.get_object(pk=pk)
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            teacher = Teacher.objects.get(pk=pk)
            teacher.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Teacher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
