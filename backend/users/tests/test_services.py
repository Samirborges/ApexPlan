import pytest

from .factories import UserFactory


@pytest.mark.django_db
def test_create_user_factory():

    user = UserFactory()

    assert user.id is not None


@pytest.mark.django_db
def test_password_is_hashed():

    user = UserFactory()

    assert user.check_password("123456")