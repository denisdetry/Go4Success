from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, SiteViewSet, AttendViewSet, RoomViewSet

router = DefaultRouter()

router.register(r'sites', SiteViewSet)
router.register(r'attends', AttendViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'activity', ActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('sites/', include(router.urls)),
]
