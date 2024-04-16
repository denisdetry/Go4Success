from database.models import FeedbackActivity
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .serializers import FeedbackActivitySerializer
from database.models import Teacher, Activity, User, Attend
from rest_framework.views import APIView
from rest_framework import viewsets
from .validations import validate_student_in_activity


class FeedbackCreateView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)


class FeedbackListView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = FeedbackActivity.objects.all()
    serializer_class = FeedbackActivitySerializer
