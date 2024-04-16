from django.urls import path, include
from rest_framework import routers
from .views import QuestionnaireView, QuestionView


router = routers.DefaultRouter()
router.register(r'postquestionnaire', QuestionnaireView, "postquestionnaire")
router.register(r'postquestion', QuestionView, "postquestion")
urlpatterns = [
    path('', include(router.urls)),
]
