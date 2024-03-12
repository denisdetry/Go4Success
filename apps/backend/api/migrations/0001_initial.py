# Generated by Django 5.0.3 on 2024-03-11 16:18

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
                ('password', models.CharField(
                    max_length=128, verbose_name='password')),
                ('id', models.AutoField(db_column='USER_ID',
                 primary_key=True, serialize=False)),
                ('username', models.CharField(
                    db_column='USERNAME', max_length=255, unique=True)),
                ('email', models.EmailField(
                    db_column='EMAIL', max_length=254, unique=True)),
                ('first_name', models.CharField(
                    db_column='FIRST_NAME', max_length=255)),
                ('last_name', models.CharField(
                    db_column='LAST_NAME', max_length=255)),
                ('noma', models.CharField(blank=True,
                 db_column='NOMA', max_length=8, null=True)),
                ('is_active', models.BooleanField(
                    db_column='IS_ACTIVE', default=True)),
                ('is_staff', models.BooleanField(
                    db_column='IS_STAFF', default=False)),
                ('is_superuser', models.BooleanField(
                    db_column='IS_SUPERUSER', default=False)),
                ('date_join', models.DateTimeField(
                    db_column='DATE_JOIN', default=django.utils.timezone.now)),
                ('last_login', models.DateTimeField(
                    blank=True, db_column='LAST_LOGIN', null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
                 related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.',
                 related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'db_table': 'USER',
            },
        ),
        migrations.CreateModel(
            name='COURSE',
            fields=[
                ('course_code', models.CharField(db_column='COURSE_CODE',
                 max_length=9, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'COURSE',
            },
        ),
        migrations.CreateModel(
            name='ADMIN',
            fields=[
                ('user', models.OneToOneField(db_column='USER', on_delete=django.db.models.deletion.CASCADE,
                 primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'ADMIN',
            },
        ),
        migrations.CreateModel(
            name='TEACHER',
            fields=[
                ('user', models.OneToOneField(db_column='USER', on_delete=django.db.models.deletion.CASCADE,
                 primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('is_tutor', models.BooleanField(db_column='IS_TUTOR')),
                ('is_professeur', models.BooleanField(db_column='IS_PROFESSEUR')),
            ],
            options={
                'db_table': 'TEACHER',
            },
        ),
        migrations.CreateModel(
            name='ANNOUNCEMENT',
            fields=[
                ('announcement_id', models.AutoField(
                    db_column='ANNOUNCEMENT_ID', primary_key=True, serialize=False)),
                ('announcement_title', models.CharField(
                    db_column='ANNOUNCEMENT_TITLE', max_length=255)),
                ('announcement_description', models.TextField(
                    db_column='ANNOUNCEMENT_DESCRIPTION')),
                ('announcement_publication_date', models.DateField(
                    db_column='ANNOUNCEMENT_DATE')),
                ('announcement_course_code', models.OneToOneField(blank=True, db_column='ANNOUNCEMENT_COURSE_CODE',
                 max_length=9, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.course')),
                ('announcement_teacher_id', models.OneToOneField(db_column='ANNOUNCEMENT_TEACHER_ID',
                 on_delete=django.db.models.deletion.CASCADE, to='api.teacher')),
            ],
            options={
                'db_table': 'ANNOUNCEMENT',
            },
        ),
        migrations.CreateModel(
            name='MESSAGE',
            fields=[
                ('message_id', models.AutoField(
                    db_column='MESSAGE_ID', primary_key=True, serialize=False)),
                ('message_content', models.TextField(db_column='MESSAGE_CONTENT')),
                ('message_date', models.DateField(db_column='MESSAGE_DATE')),
                ('message_from_user_id', models.OneToOneField(blank=True, db_column='MESSAGE_FROM_USER_ID', max_length=8, null=True,
                 on_delete=django.db.models.deletion.CASCADE, related_name='message_from_user_id', to=settings.AUTH_USER_MODEL)),
                ('message_to_user_id', models.OneToOneField(blank=True, db_column='MESSAGE_TO_USER_ID', max_length=8, null=True,
                 on_delete=django.db.models.deletion.CASCADE, related_name='message_to_user_id', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'MESSAGE',
            },
        ),
        migrations.CreateModel(
            name='ROOM',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('site_name', models.CharField(
                    db_column='SITE_NAME', max_length=255)),
                ('room_name', models.CharField(
                    db_column='ROOM_NAME', max_length=255)),
            ],
            options={
                'db_table': 'ROOM',
                'unique_together': {('site_name', 'room_name')},
            },
        ),
        migrations.CreateModel(
            name='ACTIVITY',
            fields=[
                ('activity_id', models.AutoField(
                    db_column='ACTIVITY_ID', primary_key=True, serialize=False)),
                ('activity_type', models.CharField(
                    db_column='ACTIVITY_TYPE', max_length=255)),
                ('activity_name', models.CharField(
                    db_column='ACTIVITY_NAME', max_length=255)),
                ('activity_description', models.TextField(
                    db_column='ACTIVITY_DESCRIPTION')),
                ('activity_date_start', models.DateField(
                    db_column='ACTIVITY_DATE_START')),
                ('activity_date_end', models.DateField(
                    db_column='ACTIVITY_DATE_END')),
                ('activty_course_code', models.ForeignKey(blank=True, db_column='ACTIVITY_COURSE_CODE',
                 max_length=9, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.course')),
                ('activity_room', models.ForeignKey(db_column='ACTIVITY_ROOM',
                 on_delete=django.db.models.deletion.CASCADE, to='api.room')),
            ],
            options={
                'db_table': 'ACTIVITY',
            },
        ),
        migrations.CreateModel(
            name='ATTENDS',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('activity', models.ForeignKey(db_column='ACTIVITY',
                 on_delete=django.db.models.deletion.CASCADE, to='api.activity')),
                ('student', models.ForeignKey(db_column='STUDENT',
                 on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'ATTENDS',
                'unique_together': {('activity', 'student')},
            },
        ),
        migrations.CreateModel(
            name='REGISTERED',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('course_code', models.OneToOneField(db_column='COURSE_CODE',
                 on_delete=django.db.models.deletion.CASCADE, to='api.course')),
                ('student_id', models.OneToOneField(db_column='STUDENT_ID',
                 on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'REGISTERED',
                'unique_together': {('student_id', 'course_code')},
            },
        ),
        migrations.CreateModel(
            name='SEES',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('announcement_id', models.OneToOneField(db_column='ANNOUNCEMENT_ID',
                 on_delete=django.db.models.deletion.CASCADE, to='api.announcement')),
                ('user_id', models.OneToOneField(db_column='USER_ID',
                 on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'SEES',
                'unique_together': {('announcement_id', 'user_id')},
            },
        ),
        migrations.CreateModel(
            name='GIVES',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_id', models.OneToOneField(db_column='ACTIVITY_ID',
                 on_delete=django.db.models.deletion.CASCADE, to='api.activity')),
                ('teacher_id', models.OneToOneField(db_column='TEACHER_ID',
                 on_delete=django.db.models.deletion.CASCADE, to='api.teacher')),
            ],
            options={
                'db_table': 'GIVES',
                'unique_together': {('activity_id', 'teacher_id')},
            },
        ),
    ]
