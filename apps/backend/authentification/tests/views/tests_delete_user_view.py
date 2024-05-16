from database.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class DeleteUserView(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@gmail.com",
            username='testuser',
            first_name='test',
            last_name='user',
            password='Testpassword123_',
            noma="20200574"
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {
                                refresh.access_token}')

    def test_delete_user_ok(self):
        data = {"password": "Testpassword123_"}
        response = self.client.delete(
            reverse('delete_user', kwargs={"id": self.user.id}), data)
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"User deleted"})

    def test_delete_user_wrong_password(self):
        data = {"password": "wrongpassword"}
        response = self.client.delete(
            reverse('delete_user', kwargs={"id": self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Mot de passe incorrect"})

    def test_delete_user_no_password(self):
        response = self.client.delete(
            reverse('delete_user', kwargs={"id": self.user.id}))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Mot de passe incorrect"})

    def test_delete_user_no_user(self):
        response = self.client.delete(reverse('delete_user', kwargs={"id": 2}))
        self.assertEqual(response.status_code, 404)
        print(response.data)
        self.assertEqual(response.data["detail"],
                         "No User matches the given query.")

    def test_delete_user_no_token(self):
        self.client.credentials()  # remove token
        response = self.client.delete(
            reverse('delete_user', kwargs={"id": self.user.id}))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.data["detail"], "Authentication credentials were not provided.")
