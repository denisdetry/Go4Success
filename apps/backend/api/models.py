from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError("The email must be set")
        if not username:
            raise ValueError("The username must be set")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email=None, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("noma", "")
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, email=None, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self._create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    noma = models.CharField(max_length=8, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    date_join = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"
        db_table = "User"

    def get_full_name(self):
        return "%s %s" % (self.last_name, self.first_name)

    def get_short_name(self):
        return self.first_name


class SiteNames(models.Model):
    site_name = models.CharField(primary_key=True, max_length=255)

    def __str__(self):
        return self.site_name

    class Meta:
        db_table = 'SiteNames'


class RoomNames(models.Model):
    room_name = models.CharField(primary_key=True, max_length=255)

    def __str__(self):
        return self.room_name

    class Meta:
        db_table = 'RoomNames'


class Room(models.Model):
    site_name = models.ForeignKey(SiteNames, max_length=255, on_delete=models.CASCADE)  # primary_key=True
    room_name = models.ForeignKey(RoomNames, max_length=255, on_delete=models.CASCADE)  # primary_key=True

    def __str__(self):
        return "%s - %s " % (self.room_name, self.site_name)

    class Meta:
        db_table = 'Room'
        unique_together = (('site_name', 'room_name'),)


class Course(models.Model):
    course_code = models.CharField(primary_key=True, max_length=9)

    def __str__(self):
        return self.course_code

    class Meta:
        db_table = 'Course'


class Activity(models.Model):
    activity_id = models.AutoField(primary_key=True)
    activity_type = models.CharField(max_length=255)
    activity_name = models.CharField(max_length=255)
    activity_description = models.TextField()
    activity_date_start = models.DateTimeField()
    activity_date_end = models.DateTimeField()
    activity_room = models.ForeignKey(Room, on_delete=models.CASCADE)
    activity_course_code = models.ForeignKey(
        Course, on_delete=models.CASCADE, max_length=9, blank=True, null=True)

    def __str__(self):
        return "(%s) %s" % (self.activity_id, self.activity_name)

    class Meta:
        db_table = 'Activity'


class Attends(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)  # primary_key=True
    student = models.ForeignKey(User, on_delete=models.CASCADE)  # primary_key=True

    def __str__(self):
        return "%s attends %s" % (self.student, self.activity)

    class Meta:
        db_table = 'Attends'
        unique_together = (('activity', 'student'),)


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    is_tutor = models.BooleanField()
    is_professeur = models.BooleanField()

    class Meta:
        db_table = 'Teacher'

    # check if the user is either tutor or professeur
    def clean(self):
        if self.is_tutor and self.is_professeur:
            raise ValidationError(
                "Un Teacher ne peut pas être à la fois un tutor et un professeur !")
        if not (self.is_tutor or self.is_professeur):
            raise ValidationError(
                "Un Teacher doit soit être un tutor, soit un professeur !")
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user


class Gives(models.Model):
    activity_id = models.ForeignKey(Activity, on_delete=models.CASCADE)
    teacher_id = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Gives'
        unique_together = (('activity_id', 'teacher_id'),)


class Announcement(models.Model):
    announcement_id = models.AutoField(primary_key=True)
    announcement_title = models.CharField(max_length=255)
    announcement_description = models.TextField()
    announcement_publication_date = models.DateTimeField()
    announcement_course_code = models.ForeignKey(Course, on_delete=models.CASCADE, max_length=9, blank=True, null=True)
    announcement_teacher_id = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Announcement'

    def __str__(self):
        return self.announcement_title


class Registered(models.Model):
    student_id = models.ForeignKey(User, on_delete=models.CASCADE)
    course_code = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Registered'
        unique_together = (('student_id', 'course_code'),)

    def __str__(self):
        return "%s is registered to %s" % (self.student_id, self.course_code)


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    message_content = models.TextField()
    message_date = models.DateTimeField()
    message_to_user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, max_length=8, blank=True, null=True, related_name='message_to_user_id')
    message_from_user_id = models.ForeignKey(
        User, on_delete=models.CASCADE, max_length=8, blank=True, null=True, related_name='message_from_user_id')

    class Meta:
        db_table = 'Message'

    def __str__(self):
        return "the message %s sent from user %s to user %s" % (
            self.message_id, self.message_from_user_id, self.message_to_user_id)


class Sees(models.Model):
    announcement_id = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'Sees'
        unique_together = (('announcement_id', 'user_id'),)

    def __str__(self):
        return "%s sees %s" % (self.user_id, self.announcement_id)
