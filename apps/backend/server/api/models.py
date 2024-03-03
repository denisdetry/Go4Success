from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class ROOM(models.Model):
    site_name = models.CharField(
        db_column='SITE_NAME', max_length=255)  # primary_key=True
    room_name = models.CharField(
        db_column='ROOM_NAME', max_length=255)  # primary_key=True

    def __str__(self):
        return self.room_name + "-" + self.site_name

    class Meta:
        db_table = 'ROOM'
        unique_together = (('site_name', 'room_name'),)


class COURSE(models.Model):
    course_code = models.CharField(
        db_column='COURSE_CODE', primary_key=True, max_length=9)

    def __str__(self):
        return self.course_code

    class Meta:
        db_table = 'COURSE'


class ACTIVITY(models.Model):
    activity_id = models.AutoField(db_column='ACTIVITY_ID', primary_key=True)
    activity_type = models.CharField(db_column='ACTIVITY_TYPE', max_length=255)
    activity_name = models.CharField(db_column='ACTIVITY_NAME', max_length=255)
    activity_date_start = models.DateField(db_column='ACTIVITY_DATE_START')
    activity_date_end = models.DateField(db_column='ACTIVITY_DATE_END')
    activity_room = models.ForeignKey(
        ROOM, on_delete=models.CASCADE, db_column='ACTIVITY_ROOM')
    activty_course_code = models.ForeignKey(
        COURSE, on_delete=models.CASCADE, db_column='ACTIVITY_COURSE_CODE', max_length=9, blank=True, null=True)

    def __str__(self):
        return "(%s) %s" % (self.activity_id, self.activity_name)

    class Meta:
        db_table = 'ACTIVITY'


class STUDENT(models.Model):
    student_id = models.OneToOneField(
        User, db_column='STUDENT_ID', primary_key=True, on_delete=models.CASCADE)
    noma = models.CharField(db_column='NOMA', max_length=8)
    student_number = models.CharField(
        db_column='STUDENT_NUMBER', max_length=8, null=True)

    def __str__(self):
        return self.student_id.first_name + " " + self.student_id.last_name

    class Meta:
        db_table = 'STUDENT'


class ATTENDS(models.Model):
    activty = models.OneToOneField(
        ACTIVITY, on_delete=models.CASCADE, db_column='ACTIVITY')  # primary_key=True
    student = models.OneToOneField(
        STUDENT,  on_delete=models.CASCADE, db_column='STUDENT')  # primary_key=True

    def __str__(self):
        return "%s attends %s" % ((self.student.student_id.last_name + " " + self.student.student_id.first_name), self.activty.activity_name)

    class Meta:
        db_table = 'ATTENDS'
        unique_together = (('activty', 'student'),)


class TEACHER(models.Model):
    user = models.OneToOneField(
        User, db_column='USER', on_delete=models.CASCADE, primary_key=True)
    is_tutor = models.BooleanField(db_column='IS_TUTOR')
    is_professeur = models.BooleanField(db_column='IS_PROFESSEUR')

    class Meta:
        db_table = 'TEACHER'

    # check if the user is either tutor or professeur
    def clean(self):
        if self.is_tutor and self.is_professeur:
            raise ValidationError(
                "Un TEACHER ne peut pas être à la fois un tutor et un professeur !")
        if self.is_tutor == False and self.is_professeur == False:
            raise ValidationError(
                "Un TEACHER doit soit être un tutor, soit un professeur !")
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class GIVES(models.Model):
    activity_id = models.OneToOneField(
        ACTIVITY, on_delete=models.CASCADE, db_column='ACTIVITY_ID')  # primary_key=True
    teacher_id = models.OneToOneField(
        TEACHER, on_delete=models.CASCADE, db_column='TEACHER_ID')  # primary_key=True

    class Meta:
        db_table = 'GIVES'
        unique_together = (('activity_id', 'teacher_id'),)


class ANNOUNCEMENT(models.Model):
    announcement_id = models.AutoField(
        db_column='ANNOUNCEMENT_ID', primary_key=True)
    announcement_title = models.CharField(
        db_column='ANNOUNCEMENT_TITLE', max_length=255)
    announcement_description = models.TextField(
        db_column='ANNOUNCEMENT_DESCRIPTION')
    announcement_publication_date = models.DateField(
        db_column='ANNOUNCEMENT_DATE')
    announcement_course_code = models.OneToOneField(
        COURSE, on_delete=models.CASCADE, db_column='ANNOUNCEMENT_COURSE_CODE', max_length=9, blank=True, null=True)
    announcement_teacher_id = models.OneToOneField(
        TEACHER, on_delete=models.CASCADE, db_column='ANNOUNCEMENT_TEACHER_ID')

    class Meta:
        db_table = 'ANNOUNCEMENT'


class REGISTERED(models.Model):
    student_id = models.OneToOneField(
        STUDENT, on_delete=models.CASCADE, db_column='STUDENT_ID')  # primary_key=True
    course_code = models.OneToOneField(
        COURSE, on_delete=models.CASCADE, db_column='COURSE_CODE')  # primary_key=True

    class Meta:
        db_table = 'REGISTERED'
        unique_together = (('student_id', 'course_code'),)


class MESSAGE(models.Model):
    message_id = models.AutoField(db_column='MESSAGE_ID', primary_key=True)
    message_content = models.TextField(db_column='MESSAGE_CONTENT')
    message_date = models.DateField(db_column='MESSAGE_DATE')
    message_to_user_id = models.OneToOneField(User, on_delete=models.CASCADE, db_column='MESSAGE_TO_USER_ID',
                                              max_length=8, blank=True, null=True, related_name='message_to_user_id')
    message_from_user_id = models.OneToOneField(
        User, on_delete=models.CASCADE, db_column='MESSAGE_FROM_USER_ID', max_length=8, blank=True, null=True, related_name='message_from_user_id')

    class Meta:
        db_table = 'MESSAGE'


class SEES(models.Model):
    announcement_id = models.OneToOneField(
        ANNOUNCEMENT, on_delete=models.CASCADE, db_column='ANNOUNCEMENT_ID')  # primary_key=True
    user_id = models.OneToOneField(
        User, on_delete=models.CASCADE, db_column='USER_ID')  # primary_key=True

    class Meta:
        db_table = 'SEES'
        unique_together = (('announcement_id', 'user_id'),)


class ADMIN(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, db_column='USER', primary_key=True)

    class Meta:
        db_table = 'ADMIN'
