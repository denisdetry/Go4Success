import json

from database.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken


class UpdateProfileViewTest(APITestCase):
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
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_update_profile_email_ok(self):
        data = json.dumps({"email": "testuser123@gmail.com"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_update_profile_fail_email_already_exists(self):
        User.objects.create_user(
            email="testuser2@gmail.com",
            username='testuser2',
            first_name='test',
            last_name='user',
            password='Testpassword123_',
        )
        data = json.dumps({"email": "testuser2@gmail.com"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['email'][0], 'Cette adresse mail est déjà utilisée.')

    def test_update_profile_fail_email_required(self):
        data = json.dumps({"email": ""})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['email'][0], 'This field may not be blank.')

    def test_update_profile_fail_email_invalid(self):
        data = json.dumps({"email": "testuser2gmail.com"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['email'][0], 'Enter a valid email address.')

    def test_update_profile_username_ok(self):
        data = json.dumps({"username": "testuser2"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_update_profile_fail_username_already_exists(self):
        User.objects.create_user(
            email="testuser2@gmail.com",
            username='testuser2',
            first_name='test',
            last_name='user',
            password='Testpassword123_',
        )

        data = json.dumps({"username": "testuser2"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['username'][0], 'Ce nom d\'utilisateur est déjà utilisé.')

    def test_update_profile_fail_username_required(self):
        data = json.dumps({"username": ""})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['username'][0], 'This field may not be blank.')

    def test_update_profile_noma_ok(self):
        data = json.dumps({"noma": "20200575"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_update_profile_fail_noma_invalid(self):
        data = json.dumps({"noma": "2020057"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['noma'][0], 'Le noma doit contenir 8 chiffres')

    def test_update_profile_fail_noma_already_exist(self):
        User.objects.create_user(
            email="testuser2@gmail.com",
            username='testuser2',
            first_name='test',
            last_name='user',
            password='Testpassword123_',
            noma="20200575"
        )
        data = json.dumps({"noma": "20200575"})
        response = self.client.patch(reverse("user_profile", args=[self.user.id]), data,
                                     content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['noma'][0], 'Ce noma est déjà utilisé.')
