from database.models import FeedbackActivity, Activity, User
from rest_framework import serializers


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', "date_start", "date_end"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'last_name', 'first_name', 'noma']


class FeedbackActivitySerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='student')
    activity = ActivitySerializer(read_only=True)
    activity_id = serializers.PrimaryKeyRelatedField(
        queryset=Activity.objects.all(), write_only=True, source='activity')

    class Meta:
        model = FeedbackActivity
        fields = [
            'id', 'student', 'student_id', 'activity', 'activity_id', 'evaluation', 'positive_point',
            'negative_point', 'suggestion', 'additional_comment', 'date_submitted'
        ]
