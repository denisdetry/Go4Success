from django.urls import path, include
from rest_framework import routers

from .views import UserView, TeacherView, EditRoleView

router = routers.DefaultRouter()
router.register(r'users', UserView, "users")
router.register(r'teachers', TeacherView, "teachers")
router.register(r'editRole', EditRoleView, "editroleview")

urlpatterns = [
    path('', include(router.urls)),
]
