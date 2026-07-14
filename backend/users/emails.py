from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model

from smtplib import SMTPException
import logging



User = get_user_model()
logger = logging.getLogger(__name__)

class PasswordResetEmailService:
    """
    Responsible for sending password reset emails.
    """

    @staticmethod
    def send(
        *,
        user,
        uid: str,
        token: str,
    ) -> None:

        reset_url = (
            f"{settings.FRONTEND_URL}"
            f"/reset-password"
            f"?uid={uid}&token={token}"
        )

        context = {
            "user": user,
            "reset_url": reset_url,
        }

        text_content = render_to_string(
            "emails/password_reset.txt",
            context,
        )

        html_content = render_to_string(
            "emails/password_reset.html",
            context,
        )

        email = EmailMultiAlternatives(
            subject="Recuperação de senha - ApexPlan",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )

        email.attach_alternative(
            html_content,
            "text/html",
        )

        try:
            email.send()
        except SMTPException as exc:
            logger.exception("Error sending recovery email.")
            raise