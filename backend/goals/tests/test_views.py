import pytest

from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from goals.models import Goal
from goals.tests.factories import GoalFactory
from objectives.tests.factories import ObjectiveFactory
from users.tests.factories import UserFactory


@pytest.mark.django_db
def test_create_goal():

    user = UserFactory()

    objective = ObjectiveFactory(user=user)

    refresh = RefreshToken.for_user(user)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.post(
        "/api/goals/",
        {
            "objective": objective.id,
            "title": "Nova Meta",
            "description": "Descrição",
            "estimated_days": 10,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    assert Goal.objects.filter(
        title="Nova Meta"
    ).exists()
    
    
@pytest.mark.django_db
def test_create_goal_requires_authentication():

    objective = ObjectiveFactory()

    client = APIClient()

    response = client.post(
        "/api/goals/",
        {
            "objective": objective.id,
            "title": "Meta",
            "estimated_days": 5,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    

@pytest.mark.django_db
def test_list_only_user_goals():

    user = UserFactory()

    other = UserFactory()

    objective1 = ObjectiveFactory(user=user)
    objective2 = ObjectiveFactory(user=other)

    GoalFactory(objective=objective1)
    GoalFactory(objective=objective2)

    refresh = RefreshToken.for_user(user)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get("/api/goals/")

    assert response.status_code == status.HTTP_200_OK

    assert len(response.data) == 1
    

@pytest.mark.django_db
def test_retrieve_goal():

    goal = GoalFactory()

    refresh = RefreshToken.for_user(
        goal.objective.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get(
        f"/api/goals/{goal.id}/"
    )

    assert response.status_code == status.HTTP_200_OK

    assert response.data["id"] == goal.id
    

@pytest.mark.django_db
def test_user_cannot_access_other_goal():

    goal = GoalFactory()

    other = UserFactory()

    refresh = RefreshToken.for_user(other)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get(
        f"/api/goals/{goal.id}/"
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    
@pytest.mark.django_db
def test_update_goal():

    goal = GoalFactory()

    refresh = RefreshToken.for_user(
        goal.objective.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.patch(
        f"/api/goals/{goal.id}/",
        {
            "title": "Título Atualizado",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    goal.refresh_from_db()

    assert goal.title == "Título Atualizado"
    
    
@pytest.mark.django_db
def test_complete_goal():

    goal = GoalFactory()

    refresh = RefreshToken.for_user(
        goal.objective.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.patch(
        f"/api/goals/{goal.id}/",
        {
            "is_completed": True,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    goal.refresh_from_db()

    assert goal.is_completed is True
    
    
@pytest.mark.django_db
def test_delete_goal():

    goal = GoalFactory()

    refresh = RefreshToken.for_user(
        goal.objective.user
    )

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.delete(
        f"/api/goals/{goal.id}/"
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT

    assert not Goal.objects.filter(
        id=goal.id
    ).exists()
