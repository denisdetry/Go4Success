from api.models import Activity, Site
from rest_framework import serializers


class ActivitySerializer(serializers.ModelSerializer):
    # Utilisation d'un SerializerMethodField pour personnaliser la représentation du champ activity_room
    room = serializers.SerializerMethodField()

    # course = CourseSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ('id', 'type', 'name', 'description', 'date_start',
                  'date_end', 'room', 'course')

    # Méthode pour personnaliser la représentation du champ activity_room
    def get_room(self, obj):
        return f"{obj.room.name} - {obj.room.site.name}"


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ('id', 'name')
