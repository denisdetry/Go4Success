"""
QuestionnaireTestCase

This class provides test cases for the functionality related to creating questionnaires in the system.

Attributes:
    factory (APIRequestFactory): An instance of APIRequestFactory used for creating requests.
    userCreation (User): A superuser instance created for testing purposes.
    userCreation2 (User): A regular user instance created for testing purposes.

Methods:
    test_create_questionnaire_invalid: Tests the creation of a questionnaire with invalid user authentication.
    test_create_questionnaire_valid: Tests the creation of a questionnaire with valid user authentication.
    test_create_empty_questionnaire: Tests the creation of an empty questionnaire with valid user authentication.
"""
from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from database.models import Questionnaire, User
from .serializers import *
from rest_framework import *
from .views import *
from django.core.exceptions import ValidationError


class QuestionnaireTestCase(APITestCase):
    def setUp(self):
        """
        Set up the test environment by creating user instances.
        """
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
            is_superuser=True,
            date_join='2024-03-30 12:07:52.031 +0100')
        self.userCreation2 = User.objects.create(
            password='$LbR#2Yq7',
            id=2,
            username='Le C',
            email='cyrylK@gmail.com',
            first_name='Cyryl',
            last_name='Kozlowski',
            noma='20200076',
            is_active=True,
            is_staff=False,
            is_superuser=False,
            date_join='2024-03-30 12:07:52.031 +0100')

    def test_create_questionnaire_invalid(self):
        """
        Test the creation of a questionnaire with invalid user authentication.
        """
        data_questionnaire = {
            "id": 2,
            "course": 2,
            "title": "super",
            "description": "superdesc",
            "points_total": 20,
            "date_start": "2024-03-30",
            "date_end": "2024-04-30",
            "language": 3
        }

        data_course = {
            "id": 2,
            "code": "INFOB123",
            "name": "super"
        }

        data_language = {
            "id": 3,
            "name": "Français",
            "code": "FR"
        }

        request_course = self.factory.post(
            '/postquestionnaire/viewcourse/', data_course)

        force_authenticate(request_course, user=self.userCreation)
        view_course = CourseView.as_view({'post': 'create'})
        response_course = view_course(request_course)
        self.assertEqual(response_course.status_code,
                         status.HTTP_201_CREATED)

        request_language = self.factory.post(
            '/postquestionnaire/viewlanguage/', data_language)

        force_authenticate(request_language, user=self.userCreation)
        view_language = LanguageView.as_view({'post': 'create'})
        response_language = view_language(request_language)
        self.assertEqual(response_language.status_code,
                         status.HTTP_201_CREATED)

        request = self.factory.post(
            '/postquestionnaire/postquestionnaire/', data_questionnaire)
        force_authenticate(request, user=self.userCreation2)
        view = QuestionnaireView.as_view({'post': 'create'})
        response = view(request)

        self.assertEqual(response.status_code,
                         status.HTTP_400_BAD_REQUEST)

    def test_create_questionnaire_valid(self):
        """
        Test the creation of a questionnaire with valid user authentication.
        """
        data_questionnaire = {
            "id": 3,
            "course": 3,
            "title": "quest1",
            "description": "questionnaire2",
            "points_total": 10,
            "date_start": "2024-03-30",
            "date_end": "2024-04-30",
            "language": 2
        }
        data_course = {
            "id": 3,
            "code": "INFOB124",
            "name": "super2"
        }

        data_language = {
            "id": 2,
            "name": "English",
            "code": "EN"
        }

        request_course = self.factory.post(
            '/postquestionnaire/viewcourse/', data_course)

        force_authenticate(request_course, user=self.userCreation)
        view_course = CourseView.as_view({'post': 'create'})
        response_course = view_course(request_course)
        self.assertEqual(response_course.status_code,
                         status.HTTP_201_CREATED)

        request_language = self.factory.post(
            '/postquestionnaire/viewlanguage/', data_language)

        force_authenticate(request_language, user=self.userCreation)
        view_language = LanguageView.as_view({'post': 'create'})
        response_language = view_language(request_language)
        self.assertEqual(response_language.status_code,
                         status.HTTP_201_CREATED)

        request = self.factory.post(
            '/postquestionnaire/postquestionnaire/', data_questionnaire)
        force_authenticate(request, user=self.userCreation)
        view = QuestionnaireView.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_empty_questionnaire(self):
        """
        Test the creation of an empty questionnaire with valid user authentication.
        """
        data = {
            "course": 2,
            "title": "",
            "description": "",
            "points_total": 0,
            "date_start": "",
            "date_end": "",
            "language": 2
        }
        request = self.factory.post(
            '/postquestionnaire/postquestionnaire/', data)
        force_authenticate(request, user=self.userCreation)
        view = QuestionnaireView.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
