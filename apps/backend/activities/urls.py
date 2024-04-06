from activities.views import ActivityViewSet, SiteViewSet, AttendViewSet, RoomViewSet, RegisterToActivityView
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'sites', SiteViewSet)
router.register(r'attends', AttendViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'activity', ActivityViewSet)
# router.register(r'register_activity', RegisterToActivityView)

urlpatterns = [
    path('', include(router.urls)),
    path('rooms/site/<int:site_id>/',
         RoomViewSet.as_view({'get': 'get_rooms_by_site'}), name='rooms-by-site'),
]
