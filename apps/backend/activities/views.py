import json
from datetime import datetime

from database.models import Activity, Attend, Room, Site, Language
from django.db.models import Q
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SiteSerializer, ActivitySerializer, \
    AttendSerializer, RoomSerializer, RegisterToActivitySerializer, \
    LanguageSerializer, ActivityCreateSerializer, GiveSerializer


class RoomViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_rooms_by_site(self, request, site_id=None):
        rooms = self.queryset.filter(site_id=site_id)
        serializer = self.serializer_class(rooms, many=True)
        return Response(serializer.data)


class SiteViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class LanguageViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def get_queryset(self):
        registered_attendances = Attend.objects.filter(
            student=self.request.user.id)
        activities_without_registration = Activity.objects.all().exclude(
            id__in=[attendance.activity.id for attendance in registered_attendances]
        )
        return filter_queryset(self, activities_without_registration)

    def create(self, request, *args, **kwargs):
        data = request.data
        data['name'] = data['title'].title()
        data['room'] = data['room']['key']

        # Get the language id
        data['language'] = data['language']['key']

        # Get time and date and convert to local time
        data['date_start'] = timezone.localtime(datetime.fromisoformat(data['dateStart']))
        data['date_end'] = timezone.localtime(datetime.fromisoformat(data['dateEnd']))

        serializer = ActivityCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        created_instance = serializer.save()
        print("ID of instance : " + str(created_instance.id))

        give_serializer = GiveSerializer(data={
            'activity': created_instance.id,    
            'teacher': data['user']
        })
        give_serializer.is_valid(raise_exception=True)
        self.perform_create(give_serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AttendViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Attend.objects.all()
    serializer_class = AttendSerializer

    def get_queryset(self):
        user_id = self.request.user.id
        qs = Attend.objects.filter(student_id=user_id)
        return filter_queryset(self, qs, "activity__")


def filter_queryset(self, qs, param=""):
    none = [None, 'undefined', 'null', '']
    name = self.request.query_params.get('name')
    site = self.request.query_params.get('site')
    room = self.request.query_params.get('room')
    date_start = self.request.query_params.get('date_start')
    date_end = self.request.query_params.get('date_end')
    language = self.request.query_params.get(
        'language')
    if name not in none:
        qs = qs.filter(**{f"{param}name__icontains": name})
    if site not in none:
        qs = qs.filter(**{f"{param}room__site__id": site})
    if room not in none:
        qs = qs.filter(**{f"{param}room__id": room})
    if language not in none:
        qs = qs.filter(**{f"{param}language__id": language})
    if date_start not in none:
        if date_end not in none:
            qs = qs.filter(
                Q(**{f"{param}date_start__date__gte": date_start}),
                Q(**{f"{param}date_end__date__lte": date_end})
            )
        else:
            qs = qs.filter(
                Q(**{f"{param}date_start__date__gte": date_start}),
                Q(**{f"{param}date_end__date__lte": date_start})
            )
    return qs


class RegisterToActivityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = Attend.objects.all()
    serializer_class = RegisterToActivitySerializer


class UnregisterFromActivityView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            activity = int(data.get('activity'))
            student = int(data.get('student'))
            attends = Attend.objects.get(activity=activity, student=student)
            attends.delete()
            return Response({'message': 'Successfully unregistered from activity'}, status=status.HTTP_200_OK)
        except Attend.DoesNotExist:
            return Response({'message': 'You are not registered to this activity'}, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return Response({'message': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
