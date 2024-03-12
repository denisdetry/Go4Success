from .serializers import *
from django.contrib.auth import login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework import viewsets
from .models import *

@APIView(['POST'])
def unregisterFromActivityView(request):
    serializer = UnregisterFromActivitySerializer(data=request.data)
    if serializer.is_valid():
        activity = serializer.validated_data['activity']
        student = serializer.validated_data['student']
        try:
            attends = ATTENDS.objects.get(activity=activity, student=student)
            attends.delete()
            return Response({'message': 'Successfully unregistered from activity'}, status=status.HTTP_200_OK)
        except ATTENDS.DoesNotExist:
            return Response({'message': 'You are not registered to this activity'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)