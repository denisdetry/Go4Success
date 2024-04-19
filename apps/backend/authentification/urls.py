from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from . import views
from .views import UpdateProfileView

router = routers.DefaultRouter()

router.register(r'user_profile', UpdateProfileView, "user_profile")

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('current_user/', views.CurrentUserView.as_view(), name='users'),
    path('change_password/<int:id>/', views.ChangePasswordView.as_view(), name='change_password'),
    path('delete_user/<int:id>/', views.DeleteUserView.as_view(), name='delete_user'),
    path('csrf_token/', views.csrf_token, name='csrf-token'),
    path("", include(router.urls)),
]

admin.site.site_title = "Go4success administration"
admin.site.site_header = "Go4success administration"
admin.site.index_title = "Go4success"
