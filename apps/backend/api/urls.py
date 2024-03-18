from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from . import views

from rolemanagment.views import UserView

router = routers.DefaultRouter()

router.register(r'register_activity',
                views.RegisterToActivityView, "register_activity")
router.register(r'activity', views.ActivityViewSet, "activity")
router.register(r'attends', views.AttendViewSet, "attends")
router.register(r'rolemanagement', UserView, "rolemanagment")

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('current_user/', views.CurrentUserView.as_view(), name='users'),
    path('rolemanagement/', UserView.as_view({'get': 'list'})),
    path("", include(router.urls))
]

admin.site.site_title = "Go4success administration"
admin.site.site_header = "Go4success administration"
admin.site.index_title = "Go4success"
