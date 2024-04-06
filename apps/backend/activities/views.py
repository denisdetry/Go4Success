from database.models import Activity, Attend, Room, Site
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from .serializers import SiteSerializer, ActivitySerializer, \
    AttendSerializer, RoomSerializer, RegisterToActivitySerializer


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


class ActivityViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    def get_queryset(self):
        qs = Activity.objects.all()
        return filter_queryset(self, qs)


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
    if name not in none:
        qs = qs.filter(**{f"{param}name__icontains": name})
    if site not in none:
        qs = qs.filter(**{f"{param}room__site__id": site})
    if room not in none:
        qs = qs.filter(**{f"{param}room__id": room})
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
    permission_classes = (permissions.IsAuthenticated,)

    queryset = Attend.objects.all()
    serializer_class = RegisterToActivitySerializer
