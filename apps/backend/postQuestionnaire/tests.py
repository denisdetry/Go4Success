from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from database.models import Questionnaire, User
from .serializers import *
from rest_framework import *
from .views import *
from django.core.exceptions import ValidationError


class QuestionnaireTestCase(APITestCase):
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
            is_superuser=True,
            date_join='2024-03-30 12:07:52.031 +0100')

    def test_create_questionnaire(self):
        data_questionnaire = {
            "id": 1,
            "course": 1,
            "title": "super",
            "description": "superdesc",
            "points_total": 20,
            "date_start": "2024-03-30",
            "date_end": "2024-04-30",
            "language": 1
        }

        data_course = {
            "id": 1,
            "code": "INFOB123",
            "name": "super"
        }

        data_language = {
            "id": 1,
            "name": "Français",
            "code": "FR"
        }

        request_course = self.factory.post(
            '/postquestionnaire/viewcourse/', data_course)

        force_authenticate(request_course, user=self.userCreation)
        view_course = CourseView.as_view({'post': 'create'})
        response_course = view_course(request_course)

        request_language = self.factory.post(
            '/postquestionnaire/viewlanguage/', data_language)

        force_authenticate(request_language, user=self.userCreation)
        view_language = LanguageView.as_view({'post': 'create'})
        response_language = view_language(request_language)

        request = self.factory.post(
            '/postquestionnaire/postquestionnaire/', data_questionnaire)
        force_authenticate(request, user=self.userCreation)
        view = QuestionnaireView.as_view({'post': 'create'})
        response = view(request)

        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)
    """  
    def test_create_empty_questionnaire(self):
        data = {
            "course": 1,
            "title": "",
            "description": "",
            "points_total": 0,
            "date_start": "",
            "date_end": ""
        }
        request = self.factory.post(
            '/postquestionnaire/postquestionnaire', data)
        force_authenticate(request, user=self.userCreation)
        view = QuestionnaireView.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    """
