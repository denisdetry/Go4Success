import os
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from database.models import Activity, Attend, User


def validate_student_in_activity(data):
    print("validate_student_in_activity was called.")
    activity_id = data['activity'].strip()
    student_id = data['student'].strip()

    print(f"Activity ID: {activity_id}", os.getcwd())
    print(f"Student ID: {student_id}", os.getcwd())
