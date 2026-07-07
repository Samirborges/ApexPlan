import pytest
from datetime import date

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from objectives.models import Objective
from .factories import ObjectiveFactory
from users.tests.factories import UserFactory


def authenticate(client, user):

    refresh = RefreshToken.for_user(user)

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )
    
    
@pytest.mark.django_db
def test_list_objectives():

    user = UserFactory()

    ObjectiveFactory.create_batch(
        3,
        user=user,
    )

    client = APIClient()

    authenticate(client, user)

    response = client.get(
        "/api/objectives/"
    )

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data) == 3


@pytest.mark.django_db
def test_list_only_user_objectives():

    user = UserFactory()

    other = UserFactory()

    ObjectiveFactory.create_batch(
        2,
        user=user,
    )

    ObjectiveFactory.create_batch(
        4,
        user=other,
    )

    client = APIClient()

    authenticate(client, user)

    response = client.get(
        "/api/objectives/"
    )

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data) == 2
    

@pytest.mark.django_db
def test_create_objective():

    user = UserFactory()

    client = APIClient()

    authenticate(client, user)

    response = client.post(
        "/api/objectives/",
        {
            "title": "Aprender Django",
            "description": "DRF",
            "start_date": str(date.today()),
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    assert Objective.objects.filter(
        title="Aprender Django",
        user=user,
    ).exists()
    

@pytest.mark.django_db
def test_create_without_title():

    user = UserFactory()

    client = APIClient()

    authenticate(client, user)

    response = client.post(
        "/api/objectives/",
        {
            "description": "Teste",
            "start_date": str(date.today()),
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert "title" in response.data
    

@pytest.mark.django_db
def test_create_without_start_date():

    user = UserFactory()

    client = APIClient()

    authenticate(client, user)

    response = client.post(
        "/api/objectives/",
        {
            "title": "Novo objetivo",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST

    assert "start_date" in response.data
    