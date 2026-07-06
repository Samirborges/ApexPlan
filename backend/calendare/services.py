from django.db import transaction
from rest_framework.exceptions import PermissionDenied, ValidationError
from datetime import datetime

from goals.models import Goal
from users.models import User

from .models import CalendarEvent


class CalendarService:

    @staticmethod
    @transaction.atomic
    def create(
        *,
        user: User,
        goal: Goal | None,
        title: str,
        start,
        end,
        color: str,
    ) -> CalendarEvent:
        """
        Creates a calendar event for the authenticated user.
        """

        if goal is not None and goal.objective.user != user:
            raise PermissionDenied(
                "You cannot create events for another user's goal."
            )
            
        if end <= start:
            raise ValidationError(
                "The end date must be after the start date."
            )

        event = CalendarEvent.objects.create(
            user=user,
            goal=goal,
            title=title,
            start=start,
            end=end,
            color=color,
        )

        return event

    @staticmethod
    @transaction.atomic
    def update(
        *,
        event: CalendarEvent,
        goal: Goal | None,
        title: str,
        start: datetime,
        end: datetime,
        color: str,
    ) -> CalendarEvent:
        """
        Updates an existing calendar event.
        """

        if goal is not None and goal.objective.user != event.user:
            raise PermissionDenied(
                "You cannot associate this event with another user's goal."
            )

        event.goal = goal
        event.title = title
        event.start = start
        event.end = end
        event.color = color

        event.save(
            update_fields=[
                "goal",
                "title",
                "start",
                "end",
                "color",
            ]
        )

        return event

    @staticmethod
    @transaction.atomic
    def delete(
        *,
        event: CalendarEvent,
    ) -> None:
        """
        Deletes a calendar event.
        """

        event.delete()