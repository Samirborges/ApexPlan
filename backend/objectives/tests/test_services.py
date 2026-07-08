import pytest
from datetime import date

from objectives.models import Objective
from objectives.services import ObjectiveService

from .factories import ObjectiveFactory
from users.tests.factories import UserFactory


@pytest.mark.django_db
def test_create_objective():

    user = UserFactory()

    objective = ObjectiveService.create(
        user=user,
        title="Aprender Django",
        description="Estudar DRF",
        start_date=date.today(),
    )

    assert objective.id is not None
    assert objective.user == user
    assert objective.title == "Aprender Django"
    assert objective.description == "Estudar DRF"


@pytest.mark.django_db
def test_update_objective():

    objective = ObjectiveFactory()

    updated = ObjectiveService.update(
        objective=objective,
        title="Novo título",
        description="Nova descrição",
        start_date=date.today(),
    )

    assert updated.title == "Novo título"
    assert updated.description == "Nova descrição"


@pytest.mark.django_db
def test_delete_objective():

    objective = ObjectiveFactory()

    objective_id = objective.id

    ObjectiveService.delete(
        objective=objective
    )

    assert not Objective.objects.filter(
        id=objective_id
    ).exists()