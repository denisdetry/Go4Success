from database.models import User, Teacher
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsSuperUser
from .serializers import UserSerializer, TeacherSerializer


class UserView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny, IsSuperUser,)

    serializer_class = UserSerializer

    queryset = User.objects.all()

    def get_queryset(self):
        return User.objects.exclude(last_name='').all()

    def patch(self, request, pk):
        instance = self.get_object(pk=pk)
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class TeacherView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny, IsSuperUser,)

    serializer_class = TeacherSerializer

    queryset = Teacher.objects.all()

    def get_queryset(self):
        return Teacher.objects.all()

    def patch(self, request, pk):
        instance = self.get_object(pk=pk)
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class EditRoleView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny, IsSuperUser,)

    # Patch that change the role of a user based on the id and the role received in the request
    # If the role is 'professor' or 'tutor' the user is added to the teacher table as a professor (professor = True and tutor = False) or as a tutor (professor = False and tutor = True) and the is_staff field of the user is set to True
    # If the role is 'student' and the user is in the teacher table, the user is removed from the teacher table and the superuser field is set to False
    # If the role is 'superuser' the is_superuser field of the user is set to True and the user is added to the teacher table as a professor
    def patch(self, request):
        user_id = request.data.get('id')
        role = request.data.get('role')
        user = User.objects.get(id=user_id)
        if role == 'professor' or role == 'tutor':
            user.is_staff = True
            user.save()
            if Teacher.objects.filter(user=user).exists():
                teacher = Teacher.objects.get(user=user)
                teacher.is_professor = True if role == 'professor' else False
                teacher.is_tutor = True if role == 'tutor' else False
                teacher.save()
            else:
                Teacher.objects.create(user=user, is_professor=True if role == 'professor' else False,
                                       is_tutor=True if role == 'tutor' else False)
        elif role == 'student':
            if Teacher.objects.filter(user=user).exists():
                teacher = Teacher.objects.get(user=user)
                teacher.delete()
                user.is_superuser = False
                user.save()
        elif role == 'superuser':
            user.is_superuser = True
            user.save()
            if Teacher.objects.filter(user=user).exists():
                teacher = Teacher.objects.get(user=user)
                teacher.is_professor = True
                teacher.is_tutor = False
                teacher.save()
            else:
                Teacher.objects.create(user=user, is_professor=True, is_tutor=False)

        return Response({}, status=status.HTTP_201_CREATED)
