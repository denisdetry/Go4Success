from api.models import Activity, Site
from rest_framework import viewsets, status
from rest_framework.response import Response

from .serializers import ActivitySerializer, SiteSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

    # permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SiteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

    def get(self, request):
        if request == "GET":
            serializer = self.get_serializer(data=request.data)
            return Response(serializer.data, status.HTTP_200_OK)
