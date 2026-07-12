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
    def _recalculate_schedule(objective: Objective) -> None:
        """
        Recalculates the schedule of every goal belonging to the objective.
        """
        
        if objective.start_date is None:
            objective.end_date = None
            objective.save(update_fields=["end_date"])
            return

        current_date = objective.start_date

        goals = (
            Goal.objects.filter(objective=objective)
            .order_by("order_index")
        )

        for goal in goals:

            goal.start_date = current_date

            current_date = current_date + timedelta(
                days=goal.estimated_days + goal.extra_days
            )

            goal.end_date = current_date

            goal.save(
                update_fields=[
                    "start_date",
                    "end_date",
                ]
            )

        objective.end_date = current_date
        objective.save(update_fields=["end_date"])


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
        
        

        goal = Goal.objects.create(
            objective=objective,
            title=title,
            description=description,
            order_index=GoalService._get_next_order(objective),
            estimated_days=estimated_days,
        )

        GoalService._recalculate_schedule(objective)
        
        goal.refresh_from_db()

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
        status: str,
        is_completed: bool
    ) -> Goal:
        """
        Updates an existing goal.
        """

        goal.title = title
        goal.description = description
        goal.estimated_days = estimated_days
        goal.extra_days = extra_days
        goal.is_completed = is_completed
        
        if status != goal.status:
            goal.status = status
            goal.is_completed = (
                status == Goal.Status.COMPLETED
            )

        elif is_completed != goal.is_completed:
            goal.is_completed = is_completed
            goal.status = (
                Goal.Status.COMPLETED
                if is_completed
                else Goal.Status.PENDING
            )
        
        goal.save(
            update_fields=[
                "title",
                "description",
                "estimated_days",
                "extra_days",
                "is_completed",
                "status",
            ]
        )
        
        GoalService._recalculate_schedule(
            goal.objective
        )
        
        return goal
    
    
    @staticmethod
    @transaction.atomic
    def delete(*, goal: Goal) -> None:
        """
        Deletes a goal and recalculates the objective schedule.
        """

        objective = goal.objective
        deleted_order = goal.order_index

        goal.delete()

        goals = (
            Goal.objects.filter(
                objective=objective,
                order_index__gt=deleted_order
            )
            .order_by("order_index")
        )

        for current_goal in goals:
            current_goal.order_index -= 1
            current_goal.save(update_fields=["order_index"])

        GoalService._recalculate_schedule(objective)
        
        