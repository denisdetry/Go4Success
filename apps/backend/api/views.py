from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Attend, Room, Site
from .serializers import SiteSerializer, UserRegistrationSerializer, \
    UserLoginSerializer, UserSerializer, \
    RegisterToActivityserializer, RoomSerializer
from .validations import custom_validation, validate_username, validate_password


class UserRegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        if isinstance(clean_data, Response):
            return Response(clean_data.data, status=clean_data.status_code)
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
            return Response({"id": user.id, "username": serializer.data['username'],
                             "password": serializer.data["password"], "email": user.email,
                             "first_name": user.first_name, "last_name": user.last_name, "is_active": user.is_active},
                            status=status.HTTP_200_OK)


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
        return Response(serializer.data, status=status.HTTP_200_OK)


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class AttendViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AttendSerializer

    # garder uniquement les activités de l'utilisateur connecté
    def get_queryset(self):
        user_id = self.request.user.id
        return Attend.objects.filter(student_id=user_id)


class RegisterToActivityView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)
    queryset = Attend.objects.all()
    serializer_class = RegisterToActivityserializer


class RoomViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        qs = Room.objects.all()
        site = self.request.query_params.get('site')
        if site and site.isdigit():
            qs = qs.filter(site_id=int(site))
        return qs


class SiteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
