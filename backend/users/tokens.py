from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)

User = get_user_model()

token_generator = PasswordResetTokenGenerator()


class PasswordResetService:
    """
    Service responsible for generating and validating password reset tokens.
    """

    @staticmethod
    def generate(user: AbstractBaseUser) -> tuple[str, str]:
        """
        Generates the uid and token used in password reset links.
        """

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = token_generator.make_token(user)

        return uid, token

    @staticmethod
    def validate(uid: str, token: str) -> AbstractBaseUser | None:
        """
        Validates a password reset token.

        Returns the user if the token is valid.
        Returns None otherwise.
        """

        try:
            user_id = urlsafe_base64_decode(uid).decode()

            user = User.objects.get(pk=user_id)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ):
            return None

        if token_generator.check_token(user, token):
            return user

        return None
