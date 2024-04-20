from datetime import timedelta
from django.utils import timezone
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.core.exceptions import ValidationError

from database.models import Attend, Course, FeedbackActivity, Activity, Room, Site, User
from .serializers import FeedbackActivitySerializer
from .validations import validate_student_in_activity, validate_activity_is_finished, validate_feedback_not_exists


# TODO : FIX LES TESTS ET RAJOUTER D'AUTRES


class FeedbackTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass'
        )
        self.client.force_authenticate(user=self.user)

        self.site = Site.objects.create(name="Namur")
        self.room = Room.objects.create(name='Room 1', site=self.site)
        self.course = Course.objects.create(code='Course1', name='Course 1')

        self.activity = Activity.objects.create(
            type='Type 1',
            name='Activity 1',
            description='Description 1',
            date_start="2024-03-24T21:52:12Z",
            date_end="2024-03-24T23:52:12Z",
            room=self.room,
            course=self.course
        )

        self.feedback = FeedbackActivity.objects.create(
            activity_id=self.activity.id,
            student_id=self.user.id,
            evaluation=5,
            positive_point='Good',
            negative_point='Bad',
            suggestion='None',
            additional_comment='None'
        )

        self.url = reverse('feedbacks-list')

    def test_create_feedback(self):
        print("-------test_get_feedback-------")
        response = self.client.get(self.url)
        attends = FeedbackActivity.objects.all()
        serializer = FeedbackActivitySerializer(attends, many=True)
        print("Response data:", response.data)
        print("Serializer data:", serializer.data)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ValidationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass'
        )
        self.client.force_authenticate(user=self.user)

        self.site = Site.objects.create(name="Namur")
        self.room = Room.objects.create(name='Room 1', site=self.site)
        self.course = Course.objects.create(code='Course1', name='Course 1')

        self.activity = Activity.objects.create(
            type='Type 1',
            name='Activity 1',
            description='Description 1',
            date_start=timezone.now(),
            date_end=timezone.now() + timedelta(hours=1),
            room=self.room,
            course=self.course
        )

        self.attend = Attend.objects.create(
            student=self.user, activity=self.activity)

    def test_validate_student_in_activity(self):
        print("-------test_validate_student_in_activity-------")
        # Test valid case
        data = {'activity': self.activity, 'student': self.user}
        self.assertEqual(validate_student_in_activity(data), data)

        # Test invalid case
        invalid_data = {'activity': self.activity,
                        'student': User.objects.create(username="Invalid Student")}
        with self.assertRaises(ValidationError):
            validate_student_in_activity(invalid_data)

    def test_validate_activity_is_finished(self):
        print("-------test_validate_activity_is_finished-------")
        # Test valid case
        data = {'activity': self.activity}
        self.assertEqual(validate_activity_is_finished(data), data)

        # Test invalid case
        invalid_activity = Activity.objects.create(
            name="Activity 1", date_end=timezone.now() - timedelta(days=1))
        invalid_data = {'activity': invalid_activity}
        with self.assertRaisesRegex(ValidationError, 'The activity has not ended yet'):
            validate_activity_is_finished(invalid_data)

    def test_validate_feedback_not_exists(self):
        # Test valid case
        data = {'activity': self.activity, 'student': self.user}
        self.assertEqual(validate_feedback_not_exists(data), data)

        # Test invalid case
        FeedbackActivity.objects.create(
            student=self.user, activity=self.activity, feedback="Test feedback")
        with self.assertRaises(ValidationError):
            validate_feedback_not_exists(data)
