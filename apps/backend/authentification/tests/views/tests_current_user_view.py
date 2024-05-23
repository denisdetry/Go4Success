from database.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class CurrentUserView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@gmail.com",
            username='testuser',
            password='Testpassword123_'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_current_user_ok(self):
        response = self.client.get(reverse("current_user"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'testuser@gmail.com')
        self.assertEqual(response.data['username'], 'testuser')

    def test_current_user_fail(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer invalid_token')
        response = self.client.get(reverse("current_user"))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['detail'], 'Given token not valid for any token type')
