from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .validations import validate_student_in_activity, validate_activity_is_finished, validate_feedback_not_exists, validate_feedback_date_end, validate_feedback_date_start
from database.models import Attend, Course, Feedback, FeedbackStudent, Activity, Room, Site, User
from .serializers import FeedbackSerializer
from datetime import datetime, timedelta
from django.utils import timezone

from database.models import Course, Feedback, FeedbackAdditionalQuestions, \
    FeedbackStudent, FeedbackStudentAdditionalQuestions, Activity, Room, Site, Teacher, User, Give
from .serializers import ActivitySerializer, UserSerializer, FeedbackSerializer, FeedbackAdditionalQuestionsSerializer, \
    FeedbackStudentSerializer, FeedbackStudentAdditionalQuestionsSerializer


today = datetime.now()
yesterday = today - timedelta(days=1)
tomorrow = today + timedelta(days=1)
today_str = today.strftime('%Y-%m-%d')
tomorrow_str = tomorrow.strftime('%Y-%m-%d')
yesterday_str = yesterday.strftime('%Y-%m-%d')
tomorrowTime_str = tomorrow.strftime('%Y-%m-%dT%H:%M:%SZ')
yesterdayTime_str = yesterday.strftime('%Y-%m-%dT%H:%M:%SZ')


class FeedbackViewSetTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.userAdmin = User.objects.create(
            id=1, username="testAdmin", password="testpassword", email="admin@example.com")
        self.userStudent = User.objects.create(
            id=2, username="testStudent", password="testpassword", email="student@example.com")
        self.site = Site.objects.create(name="Namur")
        self.room = Room.objects.create(name="Room1", site=self.site)
        self.course = Course.objects.create(code="Course1", name="Test Course")
        self.activity = Activity.objects.create(
            name="Activity1",
            room=self.room,
            type="workshop",
            description="Test Activity",
            date_start=yesterdayTime_str,
            date_end=tomorrowTime_str,
            course=self.course
        )
        self.feedback = Feedback.objects.create(
            user_id=1,
            activity=self.activity,
            positive_point=True,
            negative_point=True,
            suggestion=True,
            additional_comment=True,
            date_start=yesterday_str,
            date_end=tomorrow_str
        )
        self.url = reverse('feedbacks-list')

    def test_get_all_feedbacks(self):
        print("-------test_get_all_feedbacks-------")
        response = self.client.get(self.url)
        feedback = Feedback.objects.all()
        serializer = FeedbackSerializer(feedback, many=True)
        print("Response data:", response.data)
        print("Serializer data:", serializer.data)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_validate_student_in_activity_ok(self):
        print("-------test_validate_student_in_activity_ok-------")
        self.attend = Attend.objects.create(
            activity=self.activity, student=self.userStudent)
        self.assertIsNone(validate_student_in_activity(
            self.userStudent.id, self.attend.activity.id))

    def test_validate_student_in_activity_ko(self):
        print("-------test_validate_student_in_activity_ko-------")
        with self.assertRaisesMessage(Exception, 'student is not in the activity'):
            validate_student_in_activity(self.userStudent.id, self.activity.id)

    def test_validate_activity_is_finished_ok(self):
        print("-------test_validate_activity_is_finished_ok-------")
        self.activity.date_end = timezone.now() - timezone.timedelta(days=1)
        self.assertIsNone(validate_activity_is_finished(self.activity))

    def test_validate_activity_is_finished_ko(self):
        print("-------test_validate_activity_is_finished_ko-------")
        self.activity.date_end = timezone.now() + timezone.timedelta(days=1)
        with self.assertRaisesMessage(Exception, 'The activity has not ended yet'):
            validate_activity_is_finished(self.activity)

    def test_validate_feedback_not_exists_ok(self):
        print("-------test_validate_feedback_not_exists_ok-------")
        self.assertIsNone(validate_feedback_not_exists(
            self.userStudent.id, self.feedback.id))

    def test_validate_feedback_not_exists_ko(self):
        print("-------test_validate_feedback_not_exists_ko-------")
        self.feedbackStudent = FeedbackStudent.objects.create(
            student=self.userStudent,
            feedback=self.feedback,
            evaluation=5,
            positive_point="OK",
            negative_point="KO",
            suggestion="Good",
            additional_comment="Nice",
            date_submitted=today_str
        )
        with self.assertRaisesMessage(Exception, 'User has already given feedback for this activity'):
            validate_feedback_not_exists(self.userStudent.id, self.feedback.id)

    def test_validate_feedback_date_end_ok(self):
        print("-------test_validate_feedback_date_end_ok-------")
        if isinstance(self.feedback.date_end, str):
            self.feedback.date_end = datetime.strptime(
                self.feedback.date_end, '%Y-%m-%d').date()
        self.assertIsNone(validate_feedback_date_end(self.feedback))

    def test_validate_feedback_date_end_ko(self):
        print("-------test_validate_feedback_date_end_ko-------")
        yesterday = (timezone.now() - timedelta(days=1)).date()
        self.feedback.date_end = yesterday
        with self.assertRaisesMessage(Exception, 'The feedback date has ended. No more feedbacks can be created.'):
            validate_feedback_date_end(self.feedback)

    def test_validate_feedback_date_start_ok(self):
        print("-------test_validate_feedback_date_start_ok-------")
        if isinstance(self.feedback.date_start, str):
            self.feedback.date_start = datetime.strptime(
                self.feedback.date_start, '%Y-%m-%d').date()
        self.assertIsNone(validate_feedback_date_start(self.feedback))

    def test_validate_feedback_date_start_ko(self):
        print("-------test_validate_feedback_date_start_ko-------")
        tomorrow = (timezone.now() + timedelta(days=1)).date()
        self.feedback.date_start = tomorrow
        with self.assertRaisesMessage(Exception, 'The feedback date has not started yet. No feedbacks can be created.'):
            validate_feedback_date_start(self.feedback)
