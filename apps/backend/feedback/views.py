from django.forms import ValidationError
from database.models import Feedback, FeedbackAdditionalQuestions, \
    FeedbackStudent, FeedbackStudentAdditionalQuestions
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .serializers import FeedbackSerializer, FeedbackAdditionalQuestionsSerializer, \
    FeedbackStudentSerializer, FeedbackStudentAdditionalQuestionsSerializer
from .validations import validate_student_in_activity, validate_activity_is_finished, validate_feedback_not_exists


class FeedbackCreateView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    # def perform_create(self, serializer):
    #    data = serializer.validated_data
    #  # validate_student_in_activity(data)
    # validate_activity_is_finished(data)
    # validate_feedback_not_exists(data)
    #    serializer.save()

   # def create(self, request, *args, **kwargs):
   #     try:
   #         response = super().create(request, *args, **kwargs)
   #         return Response({**response.data, 'message': 'Feedback successfully created'},
   #                         status=status.HTTP_201_CREATED)
   #     except ValidationError as e:
   #         print(e)
   #         return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FeedbackListView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        none = [None, 'undefined', 'null', '']
        qs = Feedback.objects.all()
        activity_id = self.request.query_params.get('activity_id')
        if activity_id not in none:
            qs = qs.filter(activity_id=activity_id)
        return qs


class FeedbackAdditionalQuestionsView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = FeedbackAdditionalQuestions.objects.all()
    serializer_class = FeedbackAdditionalQuestionsSerializer

    def get_queryset(self):
        none = [None, 'undefined', 'null', '']
        qs = FeedbackAdditionalQuestions.objects.all()
        feedback_id = self.request.query_params.get('feedback')
        if feedback_id not in none:
            qs = qs.filter(feedback=feedback_id)
        return qs


class FeedbackStudentView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = FeedbackStudent.objects.all()
    serializer_class = FeedbackStudentSerializer


class FeedbackStudentAdditionalQuestionsView(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = FeedbackStudentAdditionalQuestions.objects.all()
    serializer_class = FeedbackStudentAdditionalQuestionsSerializer
