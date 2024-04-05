from django.contrib import admin

from .models import User, Teacher, Give, Announcement, \
    Registered, Message, See, Site, Room, Activity, Attend, Course


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'noma', 'is_active')


class SiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)


class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'site')


class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'name', 'description',
                    'date_start', 'date_end', 'room', 'course')


class AttendAdmin(admin.ModelAdmin):
    list_display = ('activity', 'student')


class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'name')


class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_tutor', 'is_professor')


class GiveAdmin(admin.ModelAdmin):
    list_display = ("activity", "teacher")


class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "description",
                    "publication_date", "course", "teacher")


class RegisteredAdmin(admin.ModelAdmin):
    list_display = ("student", "course")


class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "date",
                    "to_user", "from_user")


class SeeAdmin(admin.ModelAdmin):
    list_display = ("announcement", "user")


admin.site.register(User, UserAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Give, GiveAdmin)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Registered, RegisteredAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(See, SeeAdmin)
admin.site.register(Site, SiteAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Attend, AttendAdmin)
admin.site.register(Course, CourseAdmin)
