import pytest
from datetime import date

from rest_framework.test import APIRequestFactory

from objectives.serializers import ObjectiveSerializer
from objectives.models import Objective
from .factories import ObjectiveFactory
from users.tests.factories import UserFactory


@pytest.mark.django_db
def test_serializer_creates_objective():

    user = UserFactory()

    request = APIRequestFactory().post("/")
    request.user = user

    serializer = ObjectiveSerializer(
        data={
            "title": "Estudar Django",
            "description": "Aprender DRF",
            "start_date": date.today(),
        },
        context={"request": request},
    )

    assert serializer.is_valid()

    objective = serializer.save()

    assert objective.title == "Estudar Django"
    assert objective.user == user


@pytest.mark.django_db
def test_serializer_requires_title():

    user = UserFactory()

    request = APIRequestFactory().post("/")
    request.user = user

    serializer = ObjectiveSerializer(
        data={
            "description": "Descrição",
            "start_date": date.today(),
        },
        context={"request": request},
    )

    assert not serializer.is_valid()
    assert "title" in serializer.errors


@pytest.mark.django_db
def test_serializer_requires_start_date():

    user = UserFactory()

    request = APIRequestFactory().post("/")
    request.user = user

    serializer = ObjectiveSerializer(
        data={
            "title": "Novo objetivo",
            "description": "Descrição",
        },
        context={"request": request},
    )

    assert not serializer.is_valid()
    assert "start_date" in serializer.errors


@pytest.mark.django_db
def test_serializer_description_is_optional():

    user = UserFactory()

    request = APIRequestFactory().post("/")
    request.user = user

    serializer = ObjectiveSerializer(
        data={
            "title": "Novo objetivo",
            "start_date": date.today(),
        },
        context={"request": request},
    )

    assert serializer.is_valid()

    objective = serializer.save()

    assert objective.description == ""


@pytest.mark.django_db
def test_serializer_updates_objective():

    objective = ObjectiveFactory()

    serializer = ObjectiveSerializer(
        objective,
        data={
            "title": "Novo título",
            "description": "Nova descrição",
            "start_date": date.today(),
        },
        partial=True,
    )

    assert serializer.is_valid()

    updated = serializer.save()

    assert updated.title == "Novo título"
    assert updated.description == "Nova descrição"