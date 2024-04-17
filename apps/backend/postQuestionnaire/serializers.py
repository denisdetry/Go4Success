from django.contrib.auth import authenticate
from database.models import Questionnaire, Question, OpenAnswer, ChoiceAnswer, ChoiceAnswerInstance, Course, Language
from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ["id",
                  "course",
                  "title",
                  "description",
                  "points_total",
                  "date_start",
                  "date_end",
                  "language"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["QUESTION_TYPE_CHOICES", "id",
                  "questionnaire", "question", "type", "points"]


class OpenAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenAnswer
        fields = ["id", "question", "student", "answer", "is_correct"]


class ChoiceAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChoiceAnswer
        fields = ["id", "question", "student"]


class ChoiceAnswerInstanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChoiceAnswerInstance
        fields = ["id", "choice_answer", "choice", "is_correct"]


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ["id", "code", "name"]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name", "code"]
