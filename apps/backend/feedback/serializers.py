from database.models import Feedback, FeedbackAdditionalQuestions, \
    FeedbackStudent, FeedbackStudentAdditionalQuestions, Activity, User
from rest_framework import serializers


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', "date_start", "date_end", "course"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'last_name', 'first_name', 'noma']


class FeedbackSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='user')
    activity = ActivitySerializer(read_only=True)
    activity_id = serializers.PrimaryKeyRelatedField(
        queryset=Activity.objects.all(), write_only=True, source='activity')

    class Meta:
        model = Feedback
        fields = [
            'id', 'user', 'user_id', 'activity', 'activity_id', 'positive_point',
            'negative_point', 'suggestion', 'additional_comment', 'date_start', 'date_end']


class FeedbackAdditionalQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackAdditionalQuestions
        fields = ['id', 'feedback', 'question']


class FeedbackStudentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='student')

    class Meta:
        model = FeedbackStudent
        fields = ['id', 'student', 'student_id', 'feedback', 'evaluation', 'positive_point',
                  'negative_point', 'suggestion', 'additional_comment', 'date_submitted']


class FeedbackStudentAdditionalQuestionsSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='student')

    class Meta:
        model = FeedbackStudentAdditionalQuestions
        fields = ['id', 'student', 'student_id',
                  'feedback', 'question', 'answer']
