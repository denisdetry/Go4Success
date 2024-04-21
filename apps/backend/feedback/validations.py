from django.utils import timezone
from django.core.exceptions import ValidationError
from database.models import Attend, FeedbackActivity


def validate_student_in_activity(data):
    activity = data['activity']
    student = data['student']
    attend = Attend.objects.filter(activity=activity, student=student)
    if not attend.exists():
        raise ValidationError('student is not in the activity')
    return data


def validate_activity_is_finished(data):
    activity_id = data['activity']
    if activity_id.date_end > timezone.now():
        raise ValidationError('The activity has not ended yet')
    return data


def validate_feedback_not_exists(data):
    activity = data['activity']
    student = data['student']
    feedback = FeedbackActivity.objects.filter(
        activity=activity, student=student)
    if feedback.exists():
        raise ValidationError(
            'User has already given feedback for this activity')
    return data

# TODO DATE END
