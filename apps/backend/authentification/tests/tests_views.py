from authentification.views import LoginView
from database.models import User
from django.test import Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate


class TestViews(APITestCase):
    def setUp(self):
        self.client = Client()
        self.factory = APIRequestFactory()
        self.loginView = LoginView.as_view()
        self.user = User.objects.create_user(
            email='test@gmail.com',
            username='test',
            password='testpassword'
        )

    def test_login_POST(self):
        data = {'username': 'test', 'password': 'testpassword'}
        request = self.factory.post(reverse('login'), data, content_type='application/json')
        force_authenticate(request, user=self.user)
        response = self.loginView(request)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
