import factory

from objectives.models import Objective
from users.tests.factories import UserFactory


class ObjectiveFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Objective

    user = factory.SubFactory(UserFactory)

    title = factory.Sequence(
        lambda n: f"Objetivo {n}"
    )

    description = factory.Faker("sentence")

    start_date = factory.Faker("date_object")