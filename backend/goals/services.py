from django.db import transaction
from datetime import datetime, timedelta

from objectives.models import Objective
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

    
    def _calculate_dates(
        objective: Objective,
    ) -> tuple:
        """
        Returns the start_date for the next goal.
        """

        last_goal = (
            Goal.objects.filter(objective=objective)
            .order_by("-order_index")
            .first()
        )

        if last_goal is None:
            return objective.start_date

        return last_goal.end_date


    @staticmethod
    @transaction.atomic
    def create(
        *,
        objective: Objective,
        title: str,
        description: str,
        estimated_days: int
    ) -> Goal:
        """
        Creates a new goal for the authenticated user.
        """

        order_index = GoalService._get_next_order(objective)

        start_date = GoalService._calculate_dates(objective)
        
        end_date = start_date + timedelta(days=estimated_days)

        
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