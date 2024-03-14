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
    noma = models.CharField(max_length=63, blank=True, null=True)
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

    def get_full_name(self):
        return "%s %s" % (self.last_name, self.first_name)

    def get_short_name(self):
        return self.first_name


class Site(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (('name', 'site'),)


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=63)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.code

    class Meta:
        unique_together = (('code', 'name'),)


class Activity(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, max_length=63, blank=True, null=True)

    def __str__(self):
        return "(%s) %s" % (self.id, self.name)


class Attend(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return "%s attends %s" % (self.student, self.activity)

    class Meta:
        unique_together = (('activity', 'student'),)


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    is_tutor = models.BooleanField()
    is_professor = models.BooleanField()

    # check if the user is either tutor or professor
    def clean(self):
        if self.is_tutor and self.is_professor:
            raise ValidationError(
                "A Teacher can't be a tutor and a professor at the same time!")
        if not (self.is_tutor or self.is_professor):
            raise ValidationError(
                "A Teacher has to be a tutor or a professor!")
        super().clean()

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user


class Give(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('activity', 'teacher'),)


class Announcement(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    publication_date = models.DateTimeField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, max_length=63, blank=True, null=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Registered(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('student', 'course'),)

    def __str__(self):
        return "%s is registered to %s" % (self.student, self.course)


class Message(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    date = models.DateTimeField()
    to_user = models.ForeignKey(
        User, on_delete=models.CASCADE, max_length=63, blank=True, null=True, related_name='to_user')
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, max_length=63, blank=True, null=True, related_name='from_user')

    def __str__(self):
        return "the message %s sent from user %s to user %s" % (
            self.id, self.from_user, self.to_user)


class See(models.Model):
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('announcement', 'user'),)

    def __str__(self):
        return "%s sees %s" % (self.user, self.announcement)
