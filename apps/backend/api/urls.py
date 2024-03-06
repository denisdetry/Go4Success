from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'register_activity',
                views.registerToActivityView, "register_activity")
router.register(r'activity', views.ActivityViewSet, "activity")
router.register(r'attends', views.AttendsViewSet, "attends")

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('current_user/', views.CurrentUserView.as_view(), name='users'),
    path("", include(router.urls)),
]
