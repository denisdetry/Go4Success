from database.models import ExpoToken
from database.models import User
from django.http import JsonResponse
from django.middleware import csrf
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, generics
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserRegistrationSerializer, UserSerializer, UpdateUserSerializer, \
    ChangePasswordSerializer, ExpoTokenSerializer
from .validations import custom_validation


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        clean_data = custom_validation(request.data)
        if isinstance(clean_data, Response):
            # permet d'afficher les erreurs de validation et d'envoyer le contenu de l'erreur au front pour l'afficher dans un Toast
            return Response(clean_data.data, status=clean_data.status_code)
        user_serializer = UserRegistrationSerializer(data=clean_data)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.create(clean_data)
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            return Response({'refresh': str(refresh),
                             'access': str(refresh.access_token)}, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateProfileView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UpdateUserSerializer


class DeleteUserView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'


class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer
    lookup_field = 'id'


class ExpoTokenView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = ExpoToken.objects.all()
    serializer_class = ExpoTokenSerializer


from django.shortcuts import get_object_or_404


class MultipleFieldLookupMixin(object):
    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs.get(field, None):
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj


class UpdateExpoTokenView(MultipleFieldLookupMixin, generics.UpdateAPIView, generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ExpoToken.objects.all()
    serializer_class = ExpoTokenSerializer
    lookup_fields = ['user', 'token']

    def get_queryset(self):
        return ExpoToken.objects.filter(user=self.kwargs['id'], token=self.kwargs['token'])


@csrf_exempt
def csrf_token(request):
    if request.method == 'GET':
        return JsonResponse({'csrfToken': csrf.get_token(request)})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
