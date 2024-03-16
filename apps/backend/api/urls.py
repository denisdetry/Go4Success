from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

router.register(r'register_activity',
                views.RegisterToActivityView, "register_activity")
router.register(r'room', views.RoomViewSet, "room")
router.register(r'site', views.SiteViewSet, "site")


urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('current_user/', views.CurrentUserView.as_view(), name='users'),
    path("", include(router.urls)),
]

admin.site.site_title = "Go4success administration"
admin.site.site_header = "Go4success administration"
admin.site.index_title = "Go4success"
