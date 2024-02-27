from django.urls import path
from . import views

urlpatterns = [
	path('register/', views.UserRegisterView.as_view(), name='register'),
	path('login/', views.LoginView.as_view(), name='login'),
	path('logout/', views.LogoutView.as_view(), name='logout'),
	path('user/', views.UserView.as_view(), name='user'),
    path('users/', views.AllUsersView.as_view(), name='users'),
]