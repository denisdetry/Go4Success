from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import FeedbackCreateView, FeedbackListView

router = DefaultRouter()
router.register(r'feedbacks', FeedbackListView, basename='feedbacks')

urlpatterns = [
    path('newfeedback/',
         FeedbackCreateView.as_view({'post': 'create'}), name='newfeedback'),
] + router.urls
