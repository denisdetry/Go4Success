"""
urls.py
@author: Allemeersch Maxime <max.allemeersch@gmail.com>
@date: 02/05/2024
@description: This file includes the url for Feedback.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeedbackCreateView, FeedbackListView, FeedbackAdditionalQuestionsView, \
    FeedbackStudentView, FeedbackStudentAdditionalQuestionsView

router = DefaultRouter()

router.register(r'feedbacks', FeedbackListView, basename='feedbacks')
router.register(r'feedbackadditionnalquestions', FeedbackAdditionalQuestionsView,
                basename='feedbackadditionnalquestions')
router.register(r'feedbackstudent', FeedbackStudentView,
                basename='feedbackstudent')
router.register(r'feedbackstudentadditionnalquestions', FeedbackStudentAdditionalQuestionsView,
                basename='feedbackstudentadditionnalquestions')

urlpatterns = [
    path('', include(router.urls)),
    path('newfeedback/',
         FeedbackCreateView.as_view({'post': 'create'}), name='newfeedback'),
]
