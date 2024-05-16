from database.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken


class ChangePasswordViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@gmail.com",
            username='testuser',
            password='Testpassword123_'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {
                                refresh.access_token}')

    def test_change_password_ok(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword123_',
            'password2': 'Newpassword123_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('Newpassword123_'))

    def test_change_password_wrong_old_password(self):
        data = {
            'old_password': 'wrongpassword',
            'password': 'Newpassword123_',
            'password2': 'Newpassword123_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["old_password"], {
                         "old_password": "L'ancien mot de passe est incorrect"})

    def test_change_password_no_old_password(self):
        data = {
            'password': 'Newpassword123_',
            'password2': 'Newpassword123_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["old_password"], [
                         "This field is required."])

    def test_change_password_no_password(self):
        data = {
            'old_password': 'Testpassword123_',
            'password2': 'Newpassword123_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["password"], [
                         "This field is required."])

    def test_change_password_no_password2(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword123_',
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["password2"], [
                         "This field is required."])

    def test_change_password_no_user(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword123_',
            'password2': 'Newpassword123_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': 2}), data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["detail"],
                         "No User matches the given query.")

    def test_change_password_no_token(self):
        self.client.credentials()
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword123_',
            'password2': 'Newpassword123_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.data["detail"], "Authentication credentials were not provided.")

    def test_change_password_passwords_do_not_match(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword123_',
            'password2': 'Newpassword123_1'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["password"], [
                         "Les mots de passe ne correspondent pas"])

    def test_change_password_password_too_short(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpass',
            'password2': 'Newpass'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["error"][0], "Le mot de passe doit contenir au moins 8 caractères")

    def test_change_password_no_number_in_password(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword_',
            'password2': 'Newpassword_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["error"][0], "Le mot de passe doit contenir au moins un chiffre")

    def test_change_password_no_special_character_in_password(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'Newpassword1',
            'password2': 'Newpassword1'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["error"][0], "Le mot de passe doit contenir au moins un caractère spécial")

    def test_change_password_no_uppercase_in_password(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'newpassword1_',
            'password2': 'newpassword1_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["error"][0], "Le mot de passe doit contenir au moins une majuscule")

    def test_change_password_no_lowercase_in_password(self):
        data = {
            'old_password': 'Testpassword123_',
            'password': 'NEWPASSWORD1_',
            'password2': 'NEWPASSWORD1_'
        }
        response = self.client.put(
            reverse("change_password", kwargs={'id': self.user.id}), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["error"][0], "Le mot de passe doit contenir au moins une minuscule")
