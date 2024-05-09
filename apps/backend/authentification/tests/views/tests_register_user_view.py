import json

from database.models import User
from django.test import Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class TestRegisterUserView(APITestCase):
    def setUp(self):
        self.client = Client()

    def test_register_user_ok(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "Testpassword123_",
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data.get('access'))
        self.assertIsNotNone(response.data.get('refresh'))

    def test_register_user_fail_email_required(self):
        data = json.dumps({
            "username": "test",
            "email": "",
            # email is required. This is what we are testing. We can test with other required fields either.
            "last_name": "user",
            "first_name": "test",
            "password": "Testpassword123_",
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_fail_noma(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "Testpassword123_",
            "noma": "1234567",  # noma should be 8 digits. This is what we are testing
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_length_fail(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "Test12_",  # password should be 8 characters. This is what we are testing
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEquals(response.data, 'Le mot de passe doit contenir au moins 8 caractères')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_special_character_fail(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "Testpassword12",  # password should contain special character. This is what we are testing
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEquals(response.data, 'Le mot de passe doit contenir au moins un caractère spécial')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_uppercase_fail(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "testpassword123_",  # password should contain uppercase. This is what we are testing
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEquals(response.data, 'Le mot de passe doit contenir au moins une majuscule')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_lowercase_fail(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "TESTPASSWORD123_",  # password should contain lowercase. This is what we are testing
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEquals(response.data, 'Le mot de passe doit contenir au moins une minuscule')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_password_digit_fail(self):
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "TestPassword_",  # password should contain digit. This is what we are testing
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEquals(response.data, 'Le mot de passe doit contenir au moins un chiffre')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_email_already_exists(self):
        user = User.objects.create_user(username='testuser', email="testuser@gmail.com", password="Testpassword123_")
        data = json.dumps({
            "username": "testuser",
            "email": "testuser@gmail.com",  # email already exists. This is what we are testing
            "last_name": "user",
            "first_name": "test",
            "password": "Testpassword123_",
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEqual(response.data, "choisir une autre adresse mail, celui-ci existe déjà")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_username_already_exists(self):
        user = User.objects.create_user(username='testuser', email="testuser@gmail.com", password="Testpassword123_")
        data = json.dumps({
            "username": "testuser",  # username already exists. This is what we are testing
            "email": "testuser12@gmail.com",
            "last_name": "user",
            "first_name": "test",
            "password": "Testpassword123_",
        })
        response = self.client.post(reverse('register'), data, content_type='application/json')
        self.assertEqual(response.data, "choisir un autre nom d'utilisateur, celui-ci existe déjà")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
