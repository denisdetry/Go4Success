from django.contrib import admin
# from .models import *
from .models import *


class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'email', 'first_name', 'last_name', 'noma', 'is_active')

class RoomAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'room_name')

class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code',)

class ActivityAdmin(admin.ModelAdmin):
    list_display = ('activity_id', 'activity_type', 'activity_name', 'activity_description',
                    'activity_date_start', 'activity_date_end', 'activity_room', 'activty_course_code')

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


class MessageAdmon(admin.ModelAdmin):
    list_display = ("message_id", "message_content", "message_date",
                    "message_to_user_id", "message_from_user_id")


class SeesAdmin(admin.ModelAdmin):
    list_display = ("announcement_id", "user_id")


class AdminAdmin(admin.ModelAdmin):
    list_display = ("user",)

admin.site.register(User, UserAdmin)
admin.site.register(ROOM, RoomAdmin)
admin.site.register(COURSE, CourseAdmin)
admin.site.register(ACTIVITY, ActivityAdmin)
admin.site.register(ATTENDS, AttendsAdmin)
admin.site.register(TEACHER, TeacherAdmin)
admin.site.register(GIVES, GivesAdmin)
admin.site.register(ANNOUNCEMENT, AnnouncementAdmin)
admin.site.register(REGISTERED, RegisteredAdmin)
admin.site.register(MESSAGE, MessageAdmon)
admin.site.register(SEES, SeesAdmin)
admin.site.register(ADMIN, AdminAdmin)
