import pytest
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import status
from rest_framework.test import APIClient
from .factories import UserFactory


from users.models import User


@pytest.mark.django_db
def test_register_view_creates_user():

    client = APIClient()

    response = client.post(
        "/api/auth/register/",
        {
            "username": "alessandro",
            "email": "alessandro@email.com",
            "password": "123456",
            "confirm_password": "123456",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    assert User.objects.filter(
        email="alessandro@email.com"
    ).exists()
    
    
@pytest.mark.django_db
def test_register_passwords_do_not_match():

    client = APIClient()

    response = client.post(
        "/api/auth/register/",
        {
            "username": "alessandro",
            "email": "alessandro@email.com",
            "password": "123456",
            "confirm_password": "654321",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "confirm_password" in response.data
    

@pytest.mark.django_db
def test_register_duplicate_email():

    UserFactory(
        email="alessandro@email.com"
    )

    client = APIClient()

    response = client.post(
        "/api/auth/register/",
        {
            "username": "novo",
            "email": "alessandro@email.com",
            "password": "123456",
            "confirm_password": "123456",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    

@pytest.mark.django_db
def test_register_without_email():

    client = APIClient()

    response = client.post(
        "/api/auth/register/",
        {
            "username": "alessandro",
            "password": "123456",
            "confirm_password": "123456",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    

@pytest.mark.django_db
def test_login_success():

    User.objects.create_user(
        username="alessandro",
        email="alessandro@email.com",
        password="123456",
    )

    client = APIClient()

    response = client.post(
        "/api/auth/login/",
        {
            "email": "alessandro@email.com",
            "password": "123456",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK

    assert "access" in response.data
    assert "refresh" in response.data
    

@pytest.mark.django_db
def test_login_invalid_password():

    User.objects.create_user(
        username="alessandro",
        email="alessandro@email.com",
        password="123456",
    )

    client = APIClient()

    response = client.post(
        "/api/auth/login/",
        {
            "email": "alessandro@email.com",
            "password": "errada",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    

@pytest.mark.django_db
def test_login_nonexistent_user():

    client = APIClient()

    response = client.post(
        "/api/auth/login/",
        {
            "email": "naoexiste@email.com",
            "password": "123456",
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    

@pytest.mark.django_db
def test_me_authenticated():

    user = UserFactory()

    refresh = RefreshToken.for_user(user)

    client = APIClient()

    client.credentials(
        HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
    )

    response = client.get("/api/auth/me/")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["email"] == user.email


@pytest.mark.django_db
def test_me_without_authentication():

    client = APIClient()

    response = client.get("/api/auth/me/")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
