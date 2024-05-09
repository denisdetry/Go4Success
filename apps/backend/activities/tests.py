from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate


from database.models import Activity, Attend, Course, Room, Site, User
from .serializers import ActivitySerializer, AttendSerializer, RoomSerializer


class RoomViewSetTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.site = Site.objects.create(name="Namur")
        self.room = Room.objects.create(name="Room1", site=self.site)
        self.url = reverse('rooms-list')

    def test_get_room(self):
        print("-------test_get_room-------")
        response = self.client.get(self.url)
        room = Room.objects.all()
        serializer = RoomSerializer(room, many=True)
        print("Response data:", response.data)
        print("Serializer data:", serializer.data)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_room_not_found(self):
        print("-------test_get_room_not_found-------")
        non_existent_room_id = 9999
        url = reverse('rooms-detail', kwargs={'pk': non_existent_room_id})
        response = self.client.get(url)
        print("Response data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


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
        print("-------test_get_all_activities-------")
        response = self.client.get(self.url)
        activities = Activity.objects.all()
        serializer = ActivitySerializer(activities, many=True)
        print("Response data:", response.data)
        print("Serializer data:", serializer.data)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AttendSerializerTest(TestCase):
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

        self.activity1 = Activity.objects.create(
            type='Type 1',
            name='Activity 1',
            description='Description 1',
            date_start="2024-03-24T21:52:12Z",
            date_end="2024-03-24T23:52:12Z",
            room=self.room,
            course=self.course
        )
        self.activity2 = Activity.objects.create(
            type='Type 2',
            name='Activity 2',
            description='Description 2',
            date_start="2024-03-24T21:52:12Z",
            date_end="2024-03-24T23:52:12Z",
            room=self.room,
            course=self.course
        )

        Attend.objects.create(activity=self.activity1, student=self.user)
        Attend.objects.create(activity=self.activity2, student=self.user)

        self.url = reverse('attends-list')

    def test_attend_serializer(self):
        print("-------test_attend_serializer-------")
        response = self.client.get(self.url)
        attends = Attend.objects.all()
        serializer = AttendSerializer(attends, many=True)
        print("Response data:", response.data)
        print("Serializer data:", serializer.data)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unattend_activity(self):
        print("-------test_unattend_activity-------")
        attend = Attend.objects.get(activity=self.activity1, student=self.user)
        print("Attend objects before DELETE:", Attend.objects.count())
        url = reverse('attends-detail', kwargs={'pk': attend.pk})
        response = self.client.delete(url)
        print("Response status code:", response.status_code)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        print("Attend objects after DELETE:", Attend.objects.count())
        with self.assertRaises(Attend.DoesNotExist):
            Attend.objects.get(pk=attend.pk)
