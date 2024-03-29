from api.models import Activity, Site, Room
from .serializers import SiteSerializer, ActivitySerializer, RoomSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework import viewsets, permissions
from django.db.models import Q

from api.models import Activity, Attend, Room, Site
from .serializers import SiteSerializer, ActivitySerializer, \
    AttendSerializer, RoomSerializer


# Ancienne version #################################
# class RoomViewSet(viewsets.ModelViewSet):
#    permission_classes = (permissions.AllowAny,)
#    queryset = Room.objects.all()
#    serializer_class = RoomSerializer
#
#    def get_queryset(self):
#        qs = Room.objects.all()
#        site = self.request.query_params.get('site')
#        if site and site.isdigit():
#            qs = qs.filter(site_id=int(site))
#        return qs


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
        name = self.request.query_params.get('name')
        site = self.request.query_params.get('site')
        room = self.request.query_params.get('room')
        date_start = self.request.query_params.get('date_start')
        date_end = self.request.query_params.get('date_end')
        if name is not None:
            qs = qs.filter(name__icontains=name)
        if site is not None:
            qs = qs.filter(room__site__id=site)
        if room is not None:
            qs = qs.filter(room__id=room)
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

    # FAIT UNE FONCTION COMMUN AVEC EN HAUT ET PARAM USERID ET QS
    def get_queryset(self):
        user_id = self.request.user.id
        qs = Attend.objects.filter(student_id=user_id)
        name = self.request.query_params.get('name')
        site = self.request.query_params.get('site')
        room = self.request.query_params.get('room')
        date_start = self.request.query_params.get('date_start')
        date_end = self.request.query_params.get('date_end')
        if name is not None:
            qs = qs.filter(activity__name__icontains=name)
        if site is not None:
            qs = qs.filter(room__site__id=site)
        if room is not None:
            qs = qs.filter(room__id=room)
        if date_start not in [None, 'undefined', 'null', '']:
            if date_end not in [None, 'undefined', 'null', '']:
                qs = qs.filter(
                    Q(activity__date_start__date__gte=date_start,
                      activity__date_end__date__lte=date_end)
                )
            else:
                qs = qs.filter(
                    Q(activity__date_start__date__gte=date_start,
                      activity__date_end__date__lte=date_start)
                )
        return qs
