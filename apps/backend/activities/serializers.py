from database.models import Activity, Attend, Site, Room, Course, Language, Give
from rest_framework import serializers


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ('id', 'name')


class RoomSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ('id', 'name', 'site')


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'name')


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('id', 'name', 'code')


class ActivitySerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    language = LanguageSerializer(read_only=True)
    date_start = serializers.DateTimeField(format="%d-%m-%Y - %H:%M")
    date_end = serializers.DateTimeField(format="%d-%m-%Y - %H:%M")

    class Meta:
        model = Activity
        fields = ('id', 'type', 'name', 'description', 'date_start',
                  'date_end', 'room', 'course', 'language')

    # Méthode pour personnaliser la représentation du champ activity_room
    def get_room(self, obj):
        if obj.room:
            return f"{obj.room.name} - {obj.room.site.name}"
        return

    def get_course(self, obj):
        if obj.course:
            return f"{obj.course.code} - {obj.course.name}"
        return


class GiveSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer(read_only=True)

    class Meta:
        model = Give
        fields = ('activity', 'teacher')


class ActivityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('type', 'name', 'description', 'date_start',
                  'date_end', 'room', 'course', 'language')


class AttendSerializer(serializers.ModelSerializer):
    activity = ActivitySerializer(read_only=True)

    class Meta:
        model = Attend
        fields = ('activity', 'student')


class RegisterToActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Attend
        fields = ('activity', 'student')


class GiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Give
        fields = ('activity', 'teacher')
