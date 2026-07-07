from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from typing import cast


from goals.models import Goal
from users.models import User

from .models import CalendarEvent
from .serializers import CalendarEventSerializer
from .services import CalendarService


class CalendarEventListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer
    
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CalendarEvent.objects.filter(
            user=self.request.user
        ).select_related("goal")

    


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