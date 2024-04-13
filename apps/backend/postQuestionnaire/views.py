from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from database.models import Question, Questionnaire, OpenAnswer, ChoiceAnswerInstance, ChoiceAnswer
from .serializers import QuestionnaireSerializer, QuestionSerializer, OpenAnswerSerializer, ChoiceAnswerSerializer, ChoiceAnswerInstanceSerializer
from rest_framework.generics import DestroyAPIView
from .permissions import IsProfessorOrSuperUser

# Create your views here.


class QuestionnaireView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = QuestionnaireSerializer

    queryset = Questionnaire.objects.all()

    def get(self, request):
        data = Questionnaire.objects.all()
        serializer = QuestionnaireSerializer(data, many=True)
        return Response(serializer.data)
