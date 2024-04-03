from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from api.models import Teacher, User
from .serializers import *
from rest_framework import *
from .views import *


class RoleManagementTest(APITestCase):
    def setUp(self):

        self.factory = APIRequestFactory()
        self.userCreation = User.objects.create(
            password='$LbR#2Yq7',
            id=1,
            username='Le G',
            email='gerryL@gmail.com',
            first_name='Gerry',
            last_name='Longfils',
            noma='20190083',
            is_active=True,
            is_staff=True,
            is_superuser=False,
            date_join='2024-03-30 12:07:52.031 +0100')

        self.superuserCreation = User.objects.create(
            password='$LbR#2YqZ7',
            id=2,
            username='superUser',
            email='super@gmail.com',
            first_name='Super',
            last_name='User',
            noma='20180083',
            is_active=True,
            is_staff=True,
            is_superuser=True,
            date_join='2024-03-30 12:07:52.031 +0100')
        self.user = User.objects.get(username='Le G')
        self.superUser = User.objects.get(username='superUser')
        self.view = UserView.as_view({'get': 'list'})

        request = self.factory.get('/api/rolemanagement')
        force_authenticate(request, user=self.user)

    def test_create_connection(self):

        correct_answer = {
            "id": 1,
            "first_name": "Gerry",
            "last_name": "Longfils",
            "is_superuser": False
        }

        request = self.factory.get('/api/rolemanagement')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(dict(response.data[0]), correct_answer)

    def test_isTutor(self):

        request = self.factory.post(
            '/api/editrole', {'user': 1, 'is_professor': False, 'is_tutor': True})
        force_authenticate(request, user=self.superUser)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
