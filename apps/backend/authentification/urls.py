from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from .views import UpdateProfileView

router = routers.DefaultRouter()

router.register(r'user_profile', UpdateProfileView, "user_profile")

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('current_user/', views.CurrentUserView.as_view(), name='users'),
    path('change_password/<int:id>/',
         views.ChangePasswordView.as_view(), name='change_password'),
    path('delete_user/<int:id>/', views.DeleteUserView.as_view(), name='delete_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('expo_token/', views.ExpoTokenView.as_view(), name='expo_token'),
    path('update_expo_token/<int:user>/',
         views.UpdateExpoTokenView.as_view(), name='update_expo_token'),
    path("", include(router.urls)),
]

admin.site.site_title = "Go4success administration"
admin.site.site_header = "Go4success administration"
admin.site.index_title = "Go4success"
