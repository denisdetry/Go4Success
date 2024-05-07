from django.urls import path, include
from rest_framework import routers
from .views import QuestionnaireView, QuestionView, CourseView, LanguageView, ChoiceAnswerInstanceView, OpenQuestionView, ClosedQuestionView


router = routers.DefaultRouter()
router.register(r'postquestionnaire', QuestionnaireView, "postquestionnaire")
router.register(r'postquestion', QuestionView, "postquestion")
router.register(r'viewcourse', CourseView, "viewcourse")
router.register(r'viewlanguage', LanguageView, "viewlanguage")
router.register(r'choiceanswerinstance',
                ChoiceAnswerInstanceView, "choiceanswerinstance")

router.register(r'openquestion', OpenQuestionView, "openquestion")
router.register(r'closedquestion', ClosedQuestionView, "closedquestion")
urlpatterns = [
    path('', include(router.urls)),
]
