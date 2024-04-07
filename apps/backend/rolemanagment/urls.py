from django.urls import path, include
from rest_framework import routers
from .views import UserView, EditRoleView

router = routers.DefaultRouter()
router.register(r'rolemanagement', UserView, "rolemanagment")
router.register(r'editRole', EditRoleView, "editroleview")
router.register(r'getuser', UserView)
router.register(r'editRole', EditRoleView)

urlpatterns = [
    path('', include(router.urls)),
]
