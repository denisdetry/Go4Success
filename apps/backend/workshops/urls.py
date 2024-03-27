from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ActivityViewSet, SiteViewSet, RoomViewSet

router = DefaultRouter()

router.register(r'sites', SiteViewSet)
router.register(r'rooms', RoomViewSet, basename='rooms')
router.register(r'', ActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('rooms/site/<int:site_id>/', RoomViewSet.as_view({'get': 'get_rooms_by_site'}), name='rooms-by-site'),
]
