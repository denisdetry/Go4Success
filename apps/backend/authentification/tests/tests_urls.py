from authentification.views import UserRegisterView, CurrentUserView, UpdateProfileView, \
    ChangePasswordView, DeleteUserView, UpdateExpoTokenView
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

    def test_current_user_url_is_resolved(self):
        url = reverse('users')
        self.assertEquals(resolve(url).func.view_class, CurrentUserView)

    def test_change_password_url_is_resolved(self):
        url = reverse('change_password', args=[1])
        self.assertEquals(resolve(url).func.view_class, ChangePasswordView)

    def test_delete_user_url_is_resolved(self):
        url = reverse('delete_user', args=[1])
        self.assertEquals(resolve(url).func.view_class, DeleteUserView)

    def test_user_profile_url_is_resolved(self):
        url = reverse('user_profile-list')
        self.assertEquals(resolve(url).func.cls, UpdateProfileView)

    def test_token_url_is_resolved(self):
        url = reverse('token_obtain_pair')
        self.assertEquals(resolve(url).func.view_class.__name__, 'TokenObtainPairView')

    def test_token_refresh_url_is_resolved(self):
        url = reverse('token_refresh')
        self.assertEquals(resolve(url).func.view_class.__name__, 'TokenRefreshView')

    def test_expo_token_url_is_resolved(self):
        url = reverse('expo_token')
        self.assertEquals(resolve(url).func.cls.__name__, 'ExpoTokenView')

    def test_update_expo_token_url_is_resolved(self):
        url = reverse('update_expo_token', args=[1, 'token'])
        self.assertEquals(resolve(url).func.view_class, UpdateExpoTokenView)
