import pytest
from datetime import date

from rest_framework.exceptions import PermissionDenied

from goals.models import Goal
from goals.services import GoalService

from goals.tests.factories import GoalFactory
from objectives.tests.factories import ObjectiveFactory
from users.tests.factories import UserFactory


# -------------------------------------
#  CREATE
# -------------------------------------
@pytest.mark.django_db
def test_create_goal():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user,
        start_date=date(2026, 1, 1),
    )

    goal = GoalService.create(
        user=user,
        objective=objective,
        title="Primeira meta",
        description="Descrição",
        estimated_days=10,
    )

    assert goal.id is not None
    assert goal.order_index == 1
    assert goal.objective == objective


@pytest.mark.django_db
def test_create_goal_other_user_objective():

    owner = UserFactory()

    stranger = UserFactory()

    objective = ObjectiveFactory(
        user=owner
    )

    with pytest.raises(PermissionDenied):

        GoalService.create(
            user=stranger,
            objective=objective,
            title="Meta",
            description="",
            estimated_days=5,
        )
        

@pytest.mark.django_db
def test_goal_order_is_incremented():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user,
        start_date=date(2026, 1, 1),
    )

    first = GoalService.create(
        user=user,
        objective=objective,
        title="Goal 1",
        description="",
        estimated_days=5,
    )

    second = GoalService.create(
        user=user,
        objective=objective,
        title="Goal 2",
        description="",
        estimated_days=5,
    )

    assert first.order_index == 1
    assert second.order_index == 2
    

@pytest.mark.django_db
def test_create_recalculates_schedule():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user,
        start_date=date(2026, 1, 1),
    )

    goal = GoalService.create(
        user=user,
        objective=objective,
        title="Meta",
        description="",
        estimated_days=10,
    )

    goal.refresh_from_db()
    objective.refresh_from_db()

    assert goal.start_date == date(2026, 1, 1)
    assert goal.end_date == date(2026, 1, 11)

    assert objective.end_date == date(2026, 1, 11)


# -------------------------------------
#  UPDATE
# -------------------------------------
@pytest.mark.django_db
def test_update_goal():

    goal = GoalFactory()


    updated = GoalService.update(
        goal=goal,
        title="Novo título",
        description="Nova descrição",
        estimated_days=20,
        extra_days=3,
        is_completed=False,
    )

    assert updated.title == "Novo título"
    assert updated.description == "Nova descrição"
    assert updated.estimated_days == 20
    assert updated.extra_days == 3
    

@pytest.mark.django_db
def test_completed_goal_changes_status():

    goal = GoalFactory()

    updated = GoalService.update(
        goal=goal,
        title=goal.title,
        description=goal.description,
        estimated_days=goal.estimated_days,
        extra_days=goal.extra_days,
        is_completed=True,
    )

    assert updated.status == Goal.Status.COMPLETED
    

@pytest.mark.django_db
def test_goal_in_progress_status():

    goal = GoalFactory()

    updated = GoalService.update(
        goal=goal,
        title=goal.title,
        description=goal.description,
        estimated_days=goal.estimated_days,
        extra_days=goal.extra_days,
        is_completed=False,
    )

    assert updated.status == Goal.Status.IN_PROGRESS


# -------------------------------------
#  DELETE
# -------------------------------------
@pytest.mark.django_db
def test_delete_goal():

    goal = GoalFactory()

    GoalService.delete(
        goal=goal
    )

    assert not Goal.objects.filter(
        id=goal.id
    ).exists()
    

@pytest.mark.django_db
def test_delete_reorders_remaining_goals():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user,
        start_date=date(2026, 1, 1),
    )

    first = GoalService.create(
        user=user,
        objective=objective,
        title="1",
        description="",
        estimated_days=1,
    )

    second = GoalService.create(
        user=user,
        objective=objective,
        title="2",
        description="",
        estimated_days=1,
    )

    third = GoalService.create(
        user=user,
        objective=objective,
        title="3",
        description="",
        estimated_days=1,
    )

    GoalService.delete(
        goal=second
    )

    first.refresh_from_db()
    third.refresh_from_db()

    assert first.order_index == 1
    assert third.order_index == 2
