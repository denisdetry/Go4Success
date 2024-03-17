from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UnregisterFromActivitySerializer
from .models import *
from rest_framework.parsers import JSONParser
import json
from .models import Activity, Attend
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, ActivitySerializer, \
    AttendSerializer, RegisterToActivityserializer
from .validations import custom_validation, validate_username, validate_password

class UnregisterFromActivityView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            activity = int(data.get('activity'))
            student = int(data.get('student'))
            attends = Attend.objects.get(activity=activity, student=student)
            attends.delete()
            return Response({'message': 'Successfully unregistered from activity'}, status=status.HTTP_200_OK)
        except Attend.DoesNotExist:
            return Response({'message': 'You are not registered to this activity'}, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return Response({'message': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)

class UserRegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        user_serializer = UserRegistrationSerializer(data=clean_data)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.create(clean_data)
            if user:
                login(request, user)
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_username(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class AttendViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Attend.objects.all()
    serializer_class = AttendSerializer


class RegisterToActivityView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)
    queryset = Attend.objects.all()
    serializer_class = RegisterToActivityserializer
