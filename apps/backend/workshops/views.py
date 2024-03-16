from rest_framework import viewsets, permissions
from django.db.models import Q

from api.models import Activity, Attend, Room, Site
from .serializers import SiteSerializer, ActivitySerializer, \
    AttendSerializer, RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        qs = Room.objects.all()
        site = self.request.query_params.get('site')
        if site and site.isdigit():
            qs = qs.filter(site_id=int(site))
        return qs


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
        name = self.request.query_params.get('name')
        room = self.request.query_params.get('room')
        date_start = self.request.query_params.get('date_start')
        date_end = self.request.query_params.get('date_end')
        if name is not None:
            qs = qs.filter(name__icontains=name)
        if room is not None:
            for word in room.split():
                qs = qs.filter(Q(room__name__icontains=word) |
                               Q(room__site__name__icontains=word))
        if date_start not in [None, 'undefined', 'null', '']:
            if date_end not in [None, 'undefined', 'null', '']:
                qs = qs.filter(
                    Q(date_start__date__gte=date_start,
                      date_end__date__lte=date_end)
                )
            else:
                qs = qs.filter(
                    Q(date_start__date__gte=date_start,
                      date_end__date__lte=date_start)
                )
        return qs


class AttendViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Attend.objects.all()
    serializer_class = AttendSerializer

    def get_queryset(self):
        qs = Attend.objects.all()
        name = self.request.query_params.get('name')
        room = self.request.query_params.get('room')
        date_start = self.request.query_params.get('date_start')
        date_end = self.request.query_params.get('date_end')
        if name is not None:
            qs = qs.filter(name__icontains=name)
        if room is not None:
            for word in room.split():
                qs = qs.filter(Q(room__name__icontains=word) |
                               Q(room__site__name__icontains=word))
        if date_start not in [None, 'undefined', 'null', '']:
            if date_end not in [None, 'undefined', 'null', '']:
                qs = qs.filter(
                    Q(date_start__date__gte=date_start,
                      date_end__date__lte=date_end)
                )
            else:
                qs = qs.filter(
                    Q(date_start__date__gte=date_start,
                      date_end__date__lte=date_start)
                )
        return qs
