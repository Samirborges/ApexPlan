from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import extend_schema_view

from .models import CalendarEvent
from .serializers import CalendarEventSerializer
from .services import CalendarService


@extend_schema_view(
    get=extend_schema(
        responses=CalendarEventSerializer(many=True),
    ),
    post=extend_schema(
        request=CalendarEventSerializer,
        responses=CalendarEventSerializer,
    ),
)
class CalendarEventListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer
    
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CalendarEvent.objects.filter(
            user=self.request.user
        ).select_related("goal")

    
@extend_schema_view(
    get=extend_schema(
        responses=CalendarEventSerializer,
    ),
    put=extend_schema(
        request=CalendarEventSerializer,
        responses=CalendarEventSerializer,
    ),
    patch=extend_schema(
        request=CalendarEventSerializer,
        responses=CalendarEventSerializer,
    ),
)
class CalendarEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarEventSerializer
    
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CalendarEvent.objects.filter(
            user=self.request.user
        ).select_related("goal")


    def perform_destroy(self, instance):
        CalendarService.delete(
            event=instance
        )