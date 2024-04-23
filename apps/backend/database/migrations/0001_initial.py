# Generated by Django 5.0.3 on 2024-04-20 14:09

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(error_messages={'unique': "Ce nom d'utilisateur est déjà utilisé."}, max_length=255, unique=True)),
                ('email', models.EmailField(error_messages={'unique': 'Cette adresse mail est déjà utilisée.'}, max_length=254, unique=True)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('noma', models.CharField(blank=True, error_messages={'unique': 'Ce noma est déjà utilisé.'}, max_length=63, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('date_join', models.DateTimeField(default=django.utils.timezone.now)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('question', models.TextField()),
                ('type', models.CharField(choices=[('open', 'Open'), ('multiple_choice', 'Multiple Choice')])),
                ('points', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('is_tutor', models.BooleanField()),
                ('is_professor', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='ChoiceAnswer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.question')),
            ],
        ),
        migrations.CreateModel(
            name='ChoiceAnswerInstance',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('choice', models.TextField()),
                ('is_correct', models.BooleanField()),
                ('choice_answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.choiceanswer')),
            ],
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=63)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
                'unique_together': {('code', 'name')},
            },
        ),
        migrations.CreateModel(
            name='Announcement',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('publication_date', models.DateTimeField()),
                ('course', models.ForeignKey(blank=True, max_length=63, null=True, on_delete=django.db.models.deletion.CASCADE, to='database.course')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.teacher')),
            ],
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date_start', models.DateTimeField()),
                ('date_end', models.DateTimeField()),
                ('course', models.ForeignKey(blank=True, max_length=63, null=True, on_delete=django.db.models.deletion.CASCADE, to='database.course')),
            ],
        ),
        migrations.CreateModel(
            name='FeedbackActivity',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('evaluation', models.IntegerField()),
                ('positive_point', models.TextField(blank=True, null=True)),
                ('negative_point', models.TextField(blank=True, null=True)),
                ('suggestion', models.TextField(blank=True, null=True)),
                ('additional_comment', models.TextField(blank=True, null=True)),
                ('date_submitted', models.DateField(auto_now_add=True)),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.activity')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('code', models.CharField(max_length=6)),
            ],
            options={
                'unique_together': {('name', 'code')},
            },
        ),
        migrations.AddField(
            model_name='activity',
            name='language',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='database.language'),
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('date', models.DateTimeField()),
                ('from_user', models.ForeignKey(blank=True, max_length=63, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='from_user', to=settings.AUTH_USER_MODEL)),
                ('to_user', models.ForeignKey(blank=True, max_length=63, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='to_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OpenAnswer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('answer', models.TextField()),
                ('is_correct', models.BooleanField()),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.question')),
            ],
        ),
        migrations.CreateModel(
            name='Questionnaire',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('points_total', models.IntegerField()),
                ('date_start', models.DateTimeField()),
                ('date_end', models.DateTimeField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.course')),
                ('language', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.language')),
            ],
        ),
        migrations.AddField(
            model_name='question',
            name='questionnaire',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.questionnaire'),
        ),
        migrations.AddField(
            model_name='activity',
            name='room',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.room'),
        ),
        migrations.AddField(
            model_name='room',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.site'),
        ),
        migrations.CreateModel(
            name='Attend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.activity')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('activity', 'student')},
            },
        ),
        migrations.CreateModel(
            name='Registered',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('student', 'course')},
            },
        ),
        migrations.CreateModel(
            name='See',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('announcement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.announcement')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('announcement', 'user')},
            },
        ),
        migrations.AlterUniqueTogether(
            name='room',
            unique_together={('name', 'site')},
        ),
        migrations.CreateModel(
            name='Give',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.activity')),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.teacher')),
            ],
            options={
                'unique_together': {('activity', 'teacher')},
            },
        ),
    ]
