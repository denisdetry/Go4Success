import json

from database.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken


class TestJwtView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@gmail.com",
            username='testuser',
            password='Testpassword123_',
            first_name='test',
            last_name='user',
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_jwt_auth(self):
        data = json.dumps({
            "username": "testuser",
            "password": "Testpassword123_",
        })
        response = self.client.post(reverse("token_obtain_pair"), data, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_jwt_refresh(self):
        data = json.dumps({
            "refresh": str(RefreshToken.for_user(self.user)),
        })
        response = self.client.post(reverse("token_refresh"), data, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertNotIn("refresh", response.data)
