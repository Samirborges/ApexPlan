import pytest

from datetime import timedelta

from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from calendare.models import CalendarEvent
from calendare.services import CalendarService

from calendare.tests.factories import CalendarEventFactory
from goals.tests.factories import GoalFactory
from users.tests.factories import UserFactory


# -------------------------------------------------
# CREATE
# -------------------------------------------------

@pytest.mark.django_db
def test_create_calendar_event():

    user = UserFactory()

    goal = GoalFactory(
        objective__user=user
    )

    start = timezone.now()
    end = start + timedelta(hours=2)

    event = CalendarService.create(
        user=user,
        goal=goal,
        title="Reunião",
        start=start,
        end=end,
        color="#FF0000",
    )

    assert event.id is not None
    assert event.user == user
    assert event.goal == goal
    assert event.title == "Reunião"


@pytest.mark.django_db
def test_create_calendar_event_without_goal():

    user = UserFactory()

    start = timezone.now()
    end = start + timedelta(hours=1)

    event = CalendarService.create(
        user=user,
        goal=None,
        title="Evento livre",
        start=start,
        end=end,
        color="#3B82F6",
    )

    assert event.goal is None


@pytest.mark.django_db
def test_create_calendar_event_other_user_goal():

    owner = UserFactory()
    stranger = UserFactory()

    goal = GoalFactory(
        objective__user=owner
    )

    start = timezone.now()
    end = start + timedelta(hours=1)

    with pytest.raises(PermissionDenied):

        CalendarService.create(
            user=stranger,
            goal=goal,
            title="Evento",
            start=start,
            end=end,
            color="#000000",
        )


@pytest.mark.django_db
def test_create_calendar_event_invalid_dates():

    user = UserFactory()

    start = timezone.now()

    with pytest.raises(ValidationError):

        CalendarService.create(
            user=user,
            goal=None,
            title="Evento",
            start=start,
            end=start,
            color="#000000",
        )


# -------------------------------------------------
# UPDATE
# -------------------------------------------------

@pytest.mark.django_db
def test_update_calendar_event():

    event = CalendarEventFactory()

    new_start = timezone.now()
    new_end = new_start + timedelta(hours=4)

    updated = CalendarService.update(
        event=event,
        goal=event.goal,
        title="Novo título",
        start=new_start,
        end=new_end,
        color="#00FF00",
    )

    assert updated.title == "Novo título"
    assert updated.start == new_start
    assert updated.end == new_end
    assert updated.color == "#00FF00"


@pytest.mark.django_db
def test_update_calendar_event_remove_goal():

    event = CalendarEventFactory()

    updated = CalendarService.update(
        event=event,
        goal=None,
        title=event.title,
        start=event.start,
        end=event.end,
        color=event.color,
    )

    assert updated.goal is None


@pytest.mark.django_db
def test_update_calendar_event_other_user_goal():

    owner = UserFactory()
    stranger = UserFactory()

    event = CalendarEventFactory(
        user=owner,
        goal=None,
    )

    other_goal = GoalFactory(
        objective__user=stranger
    )

    with pytest.raises(PermissionDenied):

        CalendarService.update(
            event=event,
            goal=other_goal,
            title=event.title,
            start=event.start,
            end=event.end,
            color=event.color,
        )


# -------------------------------------------------
# DELETE
# -------------------------------------------------

@pytest.mark.django_db
def test_delete_calendar_event():

    event = CalendarEventFactory()

    CalendarService.delete(
        event=event
    )

    assert not CalendarEvent.objects.filter(
        id=event.id
    ).exists()
    
