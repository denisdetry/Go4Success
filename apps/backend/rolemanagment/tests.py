from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from api.models import Teacher, User
from .serializers import *
from rest_framework import *
from .views import *
from django.core.exceptions import ValidationError


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
        self.view_edit = EditRoleView.as_view(
            {'post': 'create'})
        self.view_patch = EditRoleView.as_view({'patch': 'partial_update'})
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

    def test_is_tutor(self):

        request = self.factory.post(
            '/api/editRole/', {'user': 1, 'is_professor': False, 'is_tutor': True}, format='json')
        force_authenticate(request, user=self.superUser)
        response = self.view_edit(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_is_professor(self):

        request = self.factory.post(
            '/api/editRole/', {'user': 1, 'is_professor': True, 'is_tutor': False}, format='json')
        force_authenticate(request, user=self.superUser)
        response = self.view_edit(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_cant_be_professor_and_tutor(self):
        request = self.factory.post(
            '/api/editRole/', {'user': 1, 'is_professor': True, 'is_tutor': True}, format='json')
        force_authenticate(request, user=self.superUser)
        with self.assertRaises(ValidationError) as context:
            response = self.view_edit(request)

        expected_error_message = '["A Teacher can\'t be a tutor and a professor at the same time!"]'
        self.assertEqual(str(context.exception), expected_error_message)

    def test_must_have_responsibilities(self):

        request = self.factory.post(
            '/api/editRole/', {'user': 1, 'is_professor': False, 'is_tutor': False}, format='json')
        force_authenticate(request, user=self.superUser)
        with self.assertRaises(ValidationError) as context:
            response = self.view_edit(request)

        expected_error_message = "['A Teacher has to be a tutor or a professor!']"
        self.assertEqual(str(context.exception), expected_error_message)

    def test_user_does_not_exists(self):

        request = self.factory.post(
            '/api/editRole/', {'user': 40, 'is_professor': False, 'is_tutor': False}, format='json')
        force_authenticate(request, user=self.superUser)

        response = self.view_edit(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_user(self):

        user_id = 1

        request_post = self.factory.post(
            '/api/editRole/', {'user': 1, 'is_professor': False, 'is_tutor': True}, format='json')

        request_patch = self.factory.patch(
            f'/api/editRole/{user_id}', {'user': 1, 'is_professor': True, 'is_tutor': False}, format='json')

        force_authenticate(request_post, user=self.superUser)

        self.view_edit(request_post)
        response = self.view_patch(request_patch, pk=user_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_professor_to_tutor(self):
        user_id = 1

        request_post = self.factory.post(
            '/api/editRole/', {'user': 1, 'is_professor': True, 'is_tutor': False}, format='json')

        request_patch = self.factory.patch(
            f'/api/editRole/{user_id}', {'user': 1, 'is_professor': False, 'is_tutor': True}, format='json')

        force_authenticate(request_post, user=self.superUser)

        self.view_edit(request_post)
        response = self.view_patch(request_patch, pk=user_id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
