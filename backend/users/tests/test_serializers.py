import pytest

from users.serializers import RegisterSerializer
from users.models import User

@pytest.mark.django_db
def test_register_serializer_is_valid():

    serializer = RegisterSerializer(
        data={
            "username": "alessandro",
            "email": "alessandro@email.com",
            "password": "123456",
            "confirm_password": "123456",
        }
    )

    assert serializer.is_valid()
    
    
@pytest.mark.django_db
def test_register_serializer_invalid_password_confirmation():

    serializer = RegisterSerializer(
        data={
            "username": "alessandro",
            "email": "alessandro@email.com",
            "password": "123456",
            "confirm_password": "654321",
        }
    )

    assert not serializer.is_valid()

    assert "confirm_password" in serializer.errors
    
    
@pytest.mark.django_db
def test_register_serializer_create_user():

    serializer = RegisterSerializer(
        data={
            "username": "alessandro",
            "email": "alessandro@email.com",
            "password": "123456",
            "confirm_password": "123456",
        }
    )

    assert serializer.is_valid()

    user = serializer.save()

    assert isinstance(user, User)

    assert user.email == "alessandro@email.com"

    assert user.check_password("123456")