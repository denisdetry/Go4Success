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
        extra_fields.setdefault("noma", None)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, email=None, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self._create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True,
                                error_messages={"unique": "Ce nom d'utilisateur est déjà utilisé."})
    email = models.EmailField(unique=True, error_messages={
        "unique": "Cette adresse mail est déjà utilisée."})
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    noma = models.CharField(max_length=8, blank=True, null=True, unique=True, default=None,
                            error_messages={"unique": "Ce noma est déjà utilisé."})
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
        return "%s (%s %s) " % (self.username, self.first_name, self.last_name)

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    def get_full_name(self):
        return "%s %s" % (self.last_name, self.first_name)

    def get_short_name(self):
        return self.first_name


class ExpoToken(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return "User %s - %s" % (self.user, self.token)

    class Meta:
        unique_together = (('user', 'token'),)


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=63)
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return "%s - %s" % (self.code, self.name)

    class Meta:
        unique_together = (('code', 'name'),)


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


class Language(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=6)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (('name'), ('code'),)


class Activity(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, max_length=63, blank=True, null=True)
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, blank=True, null=True)

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
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
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
        return self.user.username


class Give(models.Model):
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('activity', 'teacher'),)

    def __str__(self):
        return "%s gives %s" % (self.teacher, self.activity)


class Announcement(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    publication_date = models.DateTimeField()
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, max_length=63, blank=True, null=True)
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
        return "%s sees %s" % (self.user.username, self.announcement)


class Feedback(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    positive_point = models.BooleanField(null=False, blank=False)
    negative_point = models.BooleanField(null=False, blank=False)
    suggestion = models.BooleanField(null=False, blank=False)
    additional_comment = models.BooleanField(null=False, blank=False)
    date_start = models.DateField(auto_now_add=True)
    date_end = models.DateField(auto_now_add=False)

    def __str__(self):
        return f"Feedback for {self.activity.name} by {self.user.username}"


class FeedbackAdditionalQuestions(models.Model):
    id = models.AutoField(primary_key=True)
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    question = models.TextField(null=False, blank=False)

    def __str__(self):
        return f"Additional question :  {self.question} for {self.feedback.activity.name}"


class FeedbackStudent(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    evaluation = models.IntegerField(null=False, blank=False)
    positive_point = models.TextField(null=True, blank=True)
    negative_point = models.TextField(null=True, blank=True)
    suggestion = models.TextField(null=True, blank=True)
    additional_comment = models.TextField(null=True, blank=True)
    date_submitted = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Feedback answer for {self.feedback.activity.name} by {self.student.username}"


class FeedbackStudentAdditionalQuestions(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE)
    question = models.ForeignKey(
        FeedbackAdditionalQuestions, on_delete=models.CASCADE)
    answer = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Additional question answer for :  {self.question.question} -  {self.answer}"


class Questionnaire(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    points_total = models.IntegerField()
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    language = models.ForeignKey(Language, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} -{self.description} - {self.course.code} "


class Question(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('open', 'Open'),
        ('multiple_choice', 'Multiple Choice'),
    ]

    id = models.AutoField(primary_key=True)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    question = models.TextField()
    type = models.CharField(choices=QUESTION_TYPE_CHOICES)
    points = models.IntegerField()

    def __str__(self):
        return f"{self.questionnaire.title} - {self.question} - {self.type} - {self.points}"


class OpenAnswer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    answer = models.TextField()
    is_correct = models.BooleanField()

    def __str__(self):
        return f"{self.student.username} - {self.question.question} - {self.answer} - {self.is_correct}"


class ChoiceAnswer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.username} - {self.question.question}"


class ChoiceAnswerInstance(models.Model):
    id = models.AutoField(primary_key=True)
    choice_answer = models.ForeignKey(ChoiceAnswer, on_delete=models.CASCADE)
    choice = models.TextField()
    is_correct = models.BooleanField()

    def __str__(self):
        return f"{self.choice_answer.student.username} - {self.choice_answer.question.question} - {self.choice.choice}"


class OpenQuestion(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    question_text = models.TextField()

    def __str__(self):
        return f"{self.question.question} - Open Question Text: {self.question_text}"


class ClosedQuestion(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    options = models.TextField()
    checked = models.BooleanField()

    def __str__(self):
        return f"{self.question.question} - Options: {self.options} - Checked: {self.checked}"
