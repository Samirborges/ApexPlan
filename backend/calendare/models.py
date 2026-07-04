from django.db import models

from common.models import BaseModel


class CalendarEvent(BaseModel):

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="calendar_events",
    )

    goal = models.ForeignKey(
        "goals.Goal",
        on_delete=models.SET_NULL,
        related_name="calendar_events",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=255)

    start = models.DateTimeField()

    end = models.DateTimeField()

    color = models.CharField(
        max_length=7,
        default="#3B82F6",
    )

    def __str__(self):
        return self.title
    
    
    class Meta:
        ordering = ["start"]

        verbose_name = "Event"

        verbose_name_plural = "Events"