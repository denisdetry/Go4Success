from django.contrib import admin
# from .models import *
from .models import *


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'noma', 'is_active')

class SiteNameAdmin(admin.ModelAdmin):
    list_display = ('site_name',)

class RoomNameAdmin(admin.ModelAdmin):
    list_display = ('room_name',)

class RoomAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'room_name')

class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code',)

class ActivityAdmin(admin.ModelAdmin):
    list_display = ('activity_id', 'activity_type', 'activity_name', 'activity_description',
                    'activity_date_start', 'activity_date_end', 'activity_room', 'activity_course_code')

class AttendsAdmin(admin.ModelAdmin):
    list_display = ('activity', 'student')


class TeacherAdmin(admin.ModelAdmin):
    list_display = ("user", "is_tutor", "is_professeur")


class GivesAdmin(admin.ModelAdmin):
    list_display = ("activity_id", "teacher_id")


class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("announcement_id", "announcement_title", "announcement_description",
                    "announcement_publication_date", "announcement_course_code", "announcement_teacher_id")


class RegisteredAdmin(admin.ModelAdmin):
    list_display = ("student_id", "course_code")


class MessageAdmin(admin.ModelAdmin):
    list_display = ("message_id", "message_content", "message_date",
                    "message_to_user_id", "message_from_user_id")


class SeesAdmin(admin.ModelAdmin):
    list_display = ("announcement_id", "user_id")



admin.site.register(User, UserAdmin)
admin.site.register(SiteNames, SiteNameAdmin)
admin.site.register(RoomNames, RoomNameAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Attends, AttendsAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Gives, GivesAdmin)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Registered, RegisteredAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Sees, SeesAdmin)