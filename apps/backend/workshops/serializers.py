from api.models import Activity, Site
from rest_framework import serializers

from api.models import Activity, Attend, Course, Site, Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'name', 'site')


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'name')


class ActivitySerializer(serializers.ModelSerializer):
    room = serializers.SerializerMethodField()
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ('id', 'type', 'name', 'description', 'date_start',
                  'date_end', 'room', 'course')

    def get_room(self, obj):
        return f"{obj.room.name} - {obj.room.site.name}"


class AttendSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer(read_only=True)

    class Meta:
        model = Attend
        fields = ('activity', 'student')


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'name']
