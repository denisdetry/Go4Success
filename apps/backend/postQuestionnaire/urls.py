from django.urls import path, include
from rest_framework import routers
from .views import QuestionnaireView, QuestionView, CourseView, LanguageView


router = routers.DefaultRouter()
router.register(r'postquestionnaire', QuestionnaireView, "postquestionnaire")
router.register(r'postquestion', QuestionView, "postquestion")
router.register(r'viewcourse', CourseView, "viewcourse")
router.register(r'viewlanguage', LanguageView, "viewlanguage")
urlpatterns = [
    path('', include(router.urls)),
]
