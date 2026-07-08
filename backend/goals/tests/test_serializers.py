import pytest
from datetime import date

from goals.serializers import GoalSerializer
from objectives.tests.factories import ObjectiveFactory
from users.tests.factories import UserFactory


@pytest.mark.django_db
def test_goal_serializer_valid():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user
    )

    serializer = GoalSerializer(
        data={
            "objective": objective.id,
            "title": "Nova meta",
            "description": "Descrição",
            "estimated_days": 10,
        },
        context={
            "request": type(
                "Request",
                (),
                {"user": user},
            )()
        },
    )

    assert serializer.is_valid()
    

@pytest.mark.django_db
def test_goal_serializer_without_title():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user
    )

    serializer = GoalSerializer(
        data={
            "objective": objective.id,
            "estimated_days": 10,
        },
        context={
            "request": type(
                "Request",
                (),
                {"user": user},
            )()
        },
    )

    assert not serializer.is_valid()

    assert "title" in serializer.errors
    

@pytest.mark.django_db
def test_goal_serializer_without_estimated_days():

    user = UserFactory()

    objective = ObjectiveFactory(
        user=user
    )

    serializer = GoalSerializer(
        data={
            "objective": objective.id,
            "title": "Meta",
        },
        context={
            "request": type(
                "Request",
                (),
                {"user": user},
            )()
        },
    )

    assert not serializer.is_valid()

    assert "estimated_days" in serializer.errors
