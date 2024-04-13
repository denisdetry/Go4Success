from django.contrib.auth import authenticate
from database.models import Questionnaire, Question, OpenAnswer, ChoiceAnswer, ChoiceAnswerInstance
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class QuestionnaireSerializer(serializers.models):
    class Meta:
        model = Questionnaire
        fields = ["id", "course", "title", "description",
                  "points_total", "date_start", "date_end"]


class QuestionSerializer(serializers.models):
    class Meta:
        model = Question
        fields = ["QUESTION_TYPE_CHOICES", "id",
                  "questionnaire", "question", "type", "points"]


class OpenAnswerSerializer(serializers.models):
    class Meta:
        model = OpenAnswer
        fields = ["id", "question", "student", "answer", "is_correct"]


class ChoiceAnswerSerializer(serializers.models):

    class Meta:
        model = ChoiceAnswer
        fields = ["id", "question", "student"]


class ChoiceAnswerInstanceSerializer(serializers.models):

    class Meta:
        model = ChoiceAnswerInstance
        fields = ["id", "choice_answer", "choice", "is_correct"]
