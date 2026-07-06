from rest_framework import generics
from typing import cast


from goals.models import Goal
from users.models import User

from .models import CalendarEvent
from .serializers import CalendarEventSerializer
from .services import CalendarService


class CalendarEventListCreateView(generics.ListCreateAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        return CalendarEvent.objects.filter(
            user=self.request.user
        ).select_related("goal")

    def perform_create(self, serializer):
        goal = serializer.validated_data.get("goal")
        
        user = cast(User, self.request.user)

        event = CalendarService.create(
            user=user,
            goal=goal,
            title=serializer.validated_data["title"],
            start=serializer.validated_data["start"],
            end=serializer.validated_data["end"],
            color=serializer.validated_data["color"],
        )

        serializer.instance = event


class CalendarEventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        return CalendarEvent.objects.filter(
            user=self.request.user
        ).select_related("goal")

    def perform_update(self, serializer):
        goal = serializer.validated_data.get("goal")

        event = CalendarService.update(
            event=self.get_object(),
            goal=goal,
            title=serializer.validated_data["title"],
            start=serializer.validated_data["start"],
            end=serializer.validated_data["end"],
            color=serializer.validated_data["color"],
        )

        serializer.instance = event

    def perform_destroy(self, instance):
        CalendarService.delete(
            event=instance
        )