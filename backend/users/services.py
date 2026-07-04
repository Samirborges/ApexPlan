from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import User


class UserService:

    @staticmethod
    @transaction.atomic
    def register(username: str, email: str, password: str) -> User:
        """
        Registers a new user after validating business rules.
        """

        # Normalize email
        email = email.strip().lower()

        # Check username
        if User.objects.filter(username=username).exists():
            raise ValidationError(
                {
                    "username": "This username is already in use."
                }
            )

        # Check email
        if User.objects.filter(email=email).exists():
            raise ValidationError(
                {
                    "email": "This email is already registered."
                }
            )

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

        return user