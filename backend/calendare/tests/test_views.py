import pytest

from datetime import timedelta

from django.utils import timezone

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from calendare.models import CalendarEvent
from calendare.tests.factories import CalendarEventFactory
from goals.tests.factories import GoalFactory
from users.tests.factories import UserFactory


@pytest.mark.django_db
def test_list_calendar_events():

    user = UserFactory()

    CalendarEventFactory.create_batch(
        3,
        user=user,
    )

    refresh = RefreshToken.for_user(user)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get("/api/calendar/")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 3
    

@pytest.mark.django_db
def test_list_only_user_events():

    user = UserFactory()
    other = UserFactory()

    CalendarEventFactory.create_batch(2, user=user)
    CalendarEventFactory.create_batch(4, user=other)

    refresh = RefreshToken.for_user(user)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get("/api/calendar/")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2
    

@pytest.mark.django_db
def test_create_calendar_event():

    user = UserFactory()

    goal = GoalFactory(
        objective__user=user
    )

    refresh = RefreshToken.for_user(user)

    start = timezone.now()
    end = start + timedelta(hours=2)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.post(
        "/api/calendar/",
        {
            "goal": goal.id,
            "title": "Evento",
            "start": start.isoformat(),
            "end": end.isoformat(),
            "color": "#FF0000",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    assert CalendarEvent.objects.filter(
        title="Evento"
    ).exists()
    

@pytest.mark.django_db
def test_create_calendar_event_without_goal():

    user = UserFactory()

    refresh = RefreshToken.for_user(user)

    start = timezone.now()
    end = start + timedelta(hours=1)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.post(
        "/api/calendar/",
        {
            "title": "Evento",
            "start": start.isoformat(),
            "end": end.isoformat(),
            "color": "#3B82F6",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_create_calendar_invalid_dates():

    user = UserFactory()

    refresh = RefreshToken.for_user(user)

    start = timezone.now()

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.post(
        "/api/calendar/",
        {
            "title": "Evento",
            "start": start.isoformat(),
            "end": start.isoformat(),
            "color": "#3B82F6",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    

@pytest.mark.django_db
def test_create_calendar_without_authentication():

    client = APIClient()

    start = timezone.now()
    end = start + timedelta(hours=1)

    response = client.post(
        "/api/calendar/",
        {
            "title": "Evento",
            "start": start.isoformat(),
            "end": end.isoformat(),
            "color": "#3B82F6",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_retrieve_calendar_event():

    event = CalendarEventFactory()

    refresh = RefreshToken.for_user(
        event.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get(
        f"/api/calendar/{event.id}/"
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == event.id


@pytest.mark.django_db
def test_update_calendar_event():

    event = CalendarEventFactory()

    refresh = RefreshToken.for_user(
        event.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.patch(
        f"/api/calendar/{event.id}/",
        {
            "title": "Novo Evento",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    event.refresh_from_db()

    assert event.title == "Novo Evento"


@pytest.mark.django_db
def test_delete_calendar_event():

    event = CalendarEventFactory()

    refresh = RefreshToken.for_user(
        event.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.delete(
        f"/api/calendar/{event.id}/"
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    assert not CalendarEvent.objects.filter(
        id=event.id
    ).exists()


@pytest.mark.django_db
def test_cannot_access_other_user_event():

    owner = UserFactory()

    stranger = UserFactory()

    event = CalendarEventFactory(
        user=owner
    )

    refresh = RefreshToken.for_user(
        stranger
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get(
        f"/api/calendar/{event.id}/"
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
