from django.db import models

from common.models import BaseModel


class Objective(BaseModel):

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Ativo"
        COMPLETED = "COMPLETED", "Concluído"
        CANCELED = "CANCELED", "Cancelado"

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="objectives",
    )

    title = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    start_date = models.DateField()

    end_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    def __str__(self):
        return self.title
    
    
    class Meta:
        ordering = ["start_date"]

        verbose_name = "Objective"

        verbose_name_plural = "Objectives"