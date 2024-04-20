from xml.etree.ElementInclude import include
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeedbackCreateView, FeedbackListView

router = DefaultRouter()

router.register(r'feedbacks', FeedbackListView, basename='feedbacks')

urlpatterns = [
    path('', include(router.urls)),
    path('newfeedback/',
         FeedbackCreateView.as_view({'post': 'create'}), name='newfeedback'),
]
