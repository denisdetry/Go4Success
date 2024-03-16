from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ActivityViewSet, SiteViewSet

router = DefaultRouter()

router.register(r'sites', SiteViewSet)
router.register(r'', ActivityViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('sites/', include(router.urls)),
]
