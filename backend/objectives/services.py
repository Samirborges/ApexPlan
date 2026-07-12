from django.db import transaction

from .models import Objective
from users.models import User


class ObjectiveService:

    @staticmethod
    @transaction.atomic
    def create(
        *,
        user: User,
        title: str,
        description: str,
        start_date,
    ) -> Objective:
        """
        Creates a new objective for the authenticated user.
        """

        objective = Objective.objects.create(
            user=user,
            title=title,
            description=description,
            start_date=start_date,
        )

        return objective
    
    
    @staticmethod
    @transaction.atomic
    def update(
        *,
        objective: Objective,
        title: str,
        description: str,
        start_date,
        status: str,
    ) -> Objective:
        """
        Updates an existing objective.
        """
        
        objective.title = title
        objective.description = description
        objective.start_date = start_date
        objective.status = status
        
        objective.save(
            update_fields=[
                "title",
                "description",
                "start_date",
                "status",
            ]
        )
        
        return objective
    
    @staticmethod
    @transaction.atomic
    def delete(
        *,
        objective: Objective,
    ) -> None:
        """
        Deletes an objective.
        """
        
        objective.delete()
        
