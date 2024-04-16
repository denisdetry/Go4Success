from database.models import FeedbackActivity
from activities.serializers import ActivitySerializer
from authentification.serializers import UserSerializer

from rest_framework import serializers


class FeedbackActivitySerializer(serializers.ModelSerializer):
    activity = ActivitySerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = FeedbackActivity
        fields = [
            'id', 'student', 'activity', 'evaluation', 'positive_point',
            'negative_point', 'suggestion', 'additional_comment', 'date_submitted'
        ]
