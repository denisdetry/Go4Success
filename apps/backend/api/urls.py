from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'register_activity',
                views.registerToActivityView, "register_activity")
router.register(r'activity', views.ActivityViewSet, "activity")

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('user/', views.UserView.as_view(), name='user'),
    path('current_user/', views.CurrentUserView.as_view(), name='users'),
    path("", include(router.urls)),
]
