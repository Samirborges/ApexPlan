import pytest
from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APIRequestFactory

from calendare.serializers import CalendarEventSerializer
from calendare.tests.factories import CalendarEventFactory
from goals.tests.factories import GoalFactory
from users.tests.factories import UserFactory


# -------------------------------------------------
# CREATE
# -------------------------------------------------

@pytest.mark.django_db
def test_serializer_creates_event():

    user = UserFactory()
    goal = GoalFactory(objective__user=user)

    factory = APIRequestFactory()
    request = factory.post("/")

    request.user = user

    serializer = CalendarEventSerializer(
        data={
            "goal": goal.id,
            "title": "Reunião",
            "start": timezone.now(),
            "end": timezone.now() + timedelta(hours=1),
            "color": "#FF0000",
        },
        context={
            "request": request
        },
    )

    assert serializer.is_valid(), serializer.errors

    event = serializer.save()

    assert event.user == user
    assert event.goal == goal
    assert event.title == "Reunião"


# -------------------------------------------------
# UPDATE
# -------------------------------------------------

@pytest.mark.django_db
def test_serializer_updates_event():

    event = CalendarEventFactory()

    factory = APIRequestFactory()
    request = factory.put("/")

    request.user = event.user

    serializer = CalendarEventSerializer(
        instance=event,
        data={
            "goal": event.goal.id,
            "title": "Novo título",
            "start": event.start,
            "end": event.end,
            "color": "#00FF00",
        },
        context={
            "request": request
        },
    )

    assert serializer.is_valid(), serializer.errors

    updated = serializer.save()

    assert updated.title == "Novo título"
    assert updated.color == "#00FF00"


# -------------------------------------------------
# GOAL DE OUTRO USUÁRIO
# -------------------------------------------------

@pytest.mark.django_db
def test_serializer_rejects_goal_from_other_user():

    owner = UserFactory()

    stranger = UserFactory()

    goal = GoalFactory(
        objective__user=owner
    )

    factory = APIRequestFactory()

    request = factory.post("/")

    request.user = stranger

    serializer = CalendarEventSerializer(
        data={
            "goal": goal.id,
            "title": "Evento",
            "start": timezone.now(),
            "end": timezone.now() + timedelta(hours=1),
            "color": "#000000",
        },
        context={
            "request": request
        },
    )

    assert not serializer.is_valid()

    assert "goal" in serializer.errors


# -------------------------------------------------
# USER É READONLY
# -------------------------------------------------

@pytest.mark.django_db
def test_user_is_read_only():

    user = UserFactory()

    goal = GoalFactory(
        objective__user=user
    )

    factory = APIRequestFactory()

    request = factory.post("/")

    request.user = user

    serializer = CalendarEventSerializer(
        data={
            "user": 999,
            "goal": goal.id,
            "title": "Evento",
            "start": timezone.now(),
            "end": timezone.now() + timedelta(hours=1),
            "color": "#FFFFFF",
        },
        context={
            "request": request
        },
    )

    assert serializer.is_valid(), serializer.errors

    event = serializer.save()

    assert event.user == user


# -------------------------------------------------
# CAMPOS READONLY
# -------------------------------------------------

@pytest.mark.django_db
def test_read_only_fields():

    serializer = CalendarEventSerializer()

    assert serializer.fields["id"].read_only
    assert serializer.fields["user"].read_only
    assert serializer.fields["created_at"].read_only
    assert serializer.fields["updated_at"].read_only