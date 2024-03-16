from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status

from api.models import Activity, Course, Room, Site
from .serializers import ActivitySerializer


class ActivityViewSetTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.site = Site.objects.create(name="Namur")
        self.room = Room.objects.create(name="Room1", site=self.site)
        self.course = Course.objects.create(code="Course1", name="Test Course")
        self.activity = Activity.objects.create(
            name="Activity1",
            room=self.room,
            type="workshop",
            description="Test Activity",
            date_start="2024-03-24T21:52:12Z",
            date_end="2024-03-24T23:52:12Z",
            course=self.course
        )
        self.url = reverse('activity-list')

    def test_get_all_activities(self):
        response = self.client.get(self.url)
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        print("Response data:", response.data)
        print("Serializer data:", serializer.data)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
