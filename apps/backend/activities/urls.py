from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ActivityViewSet, SiteViewSet, AttendViewSet, RoomViewSet, RegisterToActivityView, LanguageViewSet, UnregisterFromActivityView

router = DefaultRouter()

router.register(r'sites', SiteViewSet, basename='sites')
router.register(r'attends', AttendViewSet, basename='attends')
router.register(r'rooms', RoomViewSet, basename='rooms')
router.register(r'activity', ActivityViewSet, basename='activity')
router.register(r'create', ActivityViewSet, basename='create')
router.register(r'register_activity', RegisterToActivityView,
                basename='register-activity')
router.register(r'languages', LanguageViewSet, basename='languages')

urlpatterns = [
    path('', include(router.urls)),
    path('rooms/site/<int:site_id>/',
         RoomViewSet.as_view({'get': 'get_rooms_by_site'}), name='rooms-by-site'),
    path('unregister_activity/', UnregisterFromActivityView.as_view(),
         name='unregister-activity'),
]
