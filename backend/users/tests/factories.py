import factory

from users.models import User


class UserFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = User
        skip_postgeneration_save = True

    username = factory.Sequence(
        lambda n: f"user{n}"
    )

    email = factory.Sequence(
        lambda n: f"user{n}@email.com"
    )

    password = factory.PostGenerationMethodCall(
        "set_password",
        "123456"
    )