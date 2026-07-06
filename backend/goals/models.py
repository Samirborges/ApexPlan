from django.db import models

from common.models import BaseModel

class Goal(BaseModel):

    class Status(models.TextChoices):
        PENDING = "PEDING", "Peding"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"


    objective = models.ForeignKey(
        "objectives.Objective",
        on_delete=models.CASCADE,
        related_name="goals",
    )

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    order_index = models.PositiveIntegerField()

    estimated_days = models.PositiveIntegerField()

    extra_days = models.PositiveIntegerField(default=0, blank=True)

    start_date = models.DateField(null=True, blank=True)

    end_date = models.DateField(null=True, blank=True)

    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["order_index"]

        verbose_name = "Goal"

        verbose_name_plural = "Goals"
