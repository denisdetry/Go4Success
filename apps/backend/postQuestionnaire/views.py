from django.contrib.auth import login, logout
from rest_framework import status, permissions
from rest_framework import viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from database.models import Question, Questionnaire, OpenAnswer, ChoiceAnswerInstance, ChoiceAnswer, Course, Language, ClosedQuestion, OpenQuestion
from .serializers import QuestionnaireSerializer, QuestionSerializer, OpenAnswerSerializer, ChoiceAnswerSerializer, ChoiceAnswerInstanceSerializer, CourseSerializer, LanguageSerializer, OpenQuestionSerializer, ClosedQuestionSerializer
from rest_framework.generics import DestroyAPIView
from .permissions import IsProfessorOrSuperUser


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

    def post(self, request):
        serializer = QuestionnaireSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = QuestionSerializer

    queryset = Question.objects.all()

    def get(self, request):
        data = Question.objects.all()
        serializer = QuestionSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        instance = self.get_object(pk=pk)
        serializer = self.get_serializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = CourseSerializer

    queryset = Course.objects.all()

    def get(self, request):
        data = Course.objects.all()
        serializer = CourseSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LanguageView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = LanguageSerializer

    queryset = Language.objects.all()

    def get(self, request):
        data = Language.objects.all()
        serializer = LanguageSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LanguageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChoiceAnswerInstanceView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = ChoiceAnswerInstanceSerializer

    queryset = ChoiceAnswerInstance.objects.all()

    def get(self, request):
        data = ChoiceAnswerInstance.objects.all()
        serializer = ChoiceAnswerInstanceSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChoiceAnswerInstanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OpenQuestionView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = OpenQuestionSerializer

    queryset = OpenQuestion.objects.all()

    def get(self, request):
        data = OpenQuestion.objects.all()
        serializer = OpenQuestionSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = OpenQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClosedQuestionView(viewsets.ModelViewSet, APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.AllowAny,)

    serializer_class = ClosedQuestionSerializer

    queryset = ClosedQuestion.objects.all()

    def get(self, request):
        data = ClosedQuestion.objects.all()
        serializer = ClosedQuestionSerializer(data, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ClosedQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
