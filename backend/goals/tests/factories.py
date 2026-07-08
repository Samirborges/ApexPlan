import factory
from datetime import date

from goals.models import Goal

from objectives.tests.factories import ObjectiveFactory


class GoalFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = Goal
        skip_postgeneration_save = True

    objective = factory.SubFactory(
        ObjectiveFactory
    )

    title = factory.Sequence(
        lambda n: f"Goal {n}"
    )

    description = factory.Faker(
        "sentence"
    )

    estimated_days = 10

    extra_days = 0

    order_index = factory.Sequence(
        lambda n: n + 1
    )

    start_date = factory.LazyFunction(date.today)