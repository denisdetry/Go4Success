from django.contrib import admin

from .models import User, Teacher, Give, Announcement, \
    Registered, Message, See, Site, Room, Activity, Attend, Course, \
    Language, FeedbackActivity, Questionnaire, Question, \
    OpenAnswer, ChoiceAnswer, ChoiceAnswerInstance


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'first_name',
                    'last_name', 'noma', 'is_active')


class SiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)


class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'site')


class LanguageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code')


class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'name', 'description',
                    'date_start', 'date_end', 'room', 'course', 'language')


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


class FeedbackActivityAdmin(admin.ModelAdmin):
    list_display = ("id", "student", "activity", "evaluation", "positive_point",
                    "negative_point", "suggestion", "additional_comment", "date_submitted")


class QuestionnaireAdmin(admin.ModelAdmin):
    list_display = ("id", "course", "title", "description",
                    "points_total", "date_start", "date_end", "language")


class QuestionAdmin(admin.ModelAdmin):
    list_display = ("id", "questionnaire", "question", "type", "points")


class OpenAnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "student", "answer", "is_correct")


class ChoiceAnswerAdmin(admin.ModelAdmin):
    list_display = ("id", "question", "student")


class ChoiceAnswerInstanceAdmin(admin.ModelAdmin):
    list_display = ("id", "choice_answer", "choice", "is_correct")


admin.site.register(User, UserAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Give, GiveAdmin)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Registered, RegisteredAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(See, SeeAdmin)
admin.site.register(Site, SiteAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(Language, LanguageAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Attend, AttendAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(FeedbackActivity, FeedbackActivityAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(OpenAnswer, OpenAnswerAdmin)
admin.site.register(ChoiceAnswer, ChoiceAnswerAdmin)
admin.site.register(ChoiceAnswerInstance, ChoiceAnswerInstanceAdmin)
