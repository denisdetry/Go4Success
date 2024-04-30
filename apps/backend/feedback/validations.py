from django.utils import timezone
from django.core.exceptions import ValidationError
from database.models import Attend, FeedbackStudent


def validate_student_in_activity(student_id, activity_id):
    attend = Attend.objects.filter(
        activity_id=activity_id, student_id=student_id)
    if not attend.exists():
        raise ValidationError('student is not in the activity')


def validate_activity_is_finished(activity):
    if activity.date_end > timezone.now():
        raise ValidationError('The activity has not ended yet')


def validate_feedback_not_exists(student_id, feedback_id):
    feedback = FeedbackStudent.objects.filter(
        feedback_id=feedback_id, student=student_id)
    if feedback.exists():
        raise ValidationError(
            'User has already given feedback for this activity')


def validate_feedback_date_end(feedback_id):
    if timezone.now().date() > feedback_id.date_end:
        raise ValidationError(
            'The feedback date has ended. No more feedbacks can be created.')


def validate_feedback_date_start(feedback_id):
    if timezone.now().date() < feedback_id.date_start:
        raise ValidationError(
            'The feedback date has not started yet. No feedbacks can be created.')
