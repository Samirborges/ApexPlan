from django.db import transaction
from datetime import date, timedelta
from rest_framework.exceptions import PermissionDenied

from objectives.models import Objective 
from users.models import User 
from .models import Goal

class GoalService:

    @staticmethod
    def _get_next_order(objective: Objective) -> int:
        """
        Returns the next order_index for the objective.
        """

        last_goal = (
            Goal.objects.filter(objective=objective)
            .order_by("-order_index")
            .first()
        )

        if last_goal is None:
            return 1

        return last_goal.order_index + 1

    
    @staticmethod
    def _calculate_dates(
        objective: Objective,
        estimated_days: int,
    ) -> tuple[date | None, date | None ]:
        """
        Returns the start_date for the next goal.
        """

        if objective.start_date is None:
            return None, None
        
        start_date = objective.start_date
        end_date = start_date + timedelta(days=estimated_days)

        return start_date, end_date


    @staticmethod
    @transaction.atomic
    def create(
        *,
        user: User,
        objective: Objective,
        title: str,
        description: str,
        estimated_days: int
    ) -> Goal:
        """
        Creates a new goal for the authenticated user.
        """

        if objective.user != user:
            raise PermissionDenied(
                "You cannot create goals for another user's objective."
            )
        
        order_index = GoalService._get_next_order(objective)

        start_date, end_date = GoalService._calculate_dates(
            objective,
            estimated_days
        )

        goal = Goal.objects.create(
            objective=objective,
            title=title,
            description=description,
            order_index=order_index,
            estimated_days=estimated_days,
            start_date=start_date,
            end_date=end_date
        )

        objective.end_date = end_date
        objective.save(update_fields=["end_date"])

        return goal


    @staticmethod
    @transaction.atomic
    def update(
        *,
        goal: Goal,
        title: str,
        description: str,
        estimated_days: int,
        extra_days: int,
        is_completed: bool
    ) -> Goal:
        """
        Updates an existing goal.
        """

        ...