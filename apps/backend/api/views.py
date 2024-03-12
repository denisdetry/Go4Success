from .serializers import *
from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .validations import custom_validation, validate_username, validate_password
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import viewsets
from .models import *

@APIView(['POST'])
def unregisterFromActivityView(request):
    serializer = UnregisterFromActivitySerializer(data=request.data)
    if serializer.is_valid():
        activity = serializer.validated_data['activity']
        student = serializer.validated_data['student']
        try:
            attends = ATTENDS.objects.get(activity=activity, student=student)
            attends.delete()
            return Response({'message': 'Successfully unregistered from activity'}, status=status.HTTP_200_OK)
        except ATTENDS.DoesNotExist:
            return Response({'message': 'You are not registered to this activity'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
    queryset = ACTIVITY.objects.all()
    serializer_class = ActivitySerializer


class AttendsViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = ATTENDS.objects.all()
    serializer_class = AttendsSerializer


class registerToActivityView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)
    queryset = ATTENDS.objects.all()
    serializer_class = registerToActivitySerializer
