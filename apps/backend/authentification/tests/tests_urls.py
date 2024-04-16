from authentification.views import UserRegisterView, LoginView, LogoutView, CurrentUserView, UpdateProfileView, \
    csrf_token, ChangePasswordView, DeleteUserView
from django.test import SimpleTestCase
from django.urls import reverse, resolve


# Guide
# if the view is a APIView
#   use resolve(url).func.view_class
# if the view is a ViewSet
#   use resolve(url).func.cls

class TestUrls(SimpleTestCase):
    def test_register_url_is_resolved(self):
        url = reverse('register')
        self.assertEquals(resolve(url).func.view_class, UserRegisterView)

    def test_login_url_is_resolved(self):
        url = reverse('login')
        self.assertEquals(resolve(url).func.view_class, LoginView)

    def test_logout_url_is_resolved(self):
        url = reverse('logout')
        self.assertEquals(resolve(url).func.view_class, LogoutView)

    def test_current_user_url_is_resolved(self):
        url = reverse('current_user')
        self.assertEquals(resolve(url).func.view_class, CurrentUserView)

    def test_change_password_url_is_resolved(self):
        url = reverse('change_password', args=[1])
        self.assertEquals(resolve(url).func.view_class, ChangePasswordView)

    def test_delete_user_url_is_resolved(self):
        url = reverse('delete_user', args=[1])
        self.assertEquals(resolve(url).func.view_class, DeleteUserView)

    def test_csrf_token_url_is_resolved(self):
        url = reverse('csrf-token')
        self.assertEquals(resolve(url).func, csrf_token)

    def test_user_profile_url_is_resolved(self):
        url = reverse('user_profile-list')
        self.assertEquals(resolve(url).func.cls, UpdateProfileView)
