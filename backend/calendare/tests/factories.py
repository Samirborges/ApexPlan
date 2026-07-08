import factory

from datetime import timedelta

from django.utils import timezone

from calendare.models import CalendarEvent

from goals.tests.factories import GoalFactory


class CalendarEventFactory(factory.django.DjangoModelFactory):

    class Meta:
        model = CalendarEvent
        skip_postgeneration_save = True

    goal = factory.SubFactory(GoalFactory)

    user = factory.SelfAttribute(
        "goal.objective.user"
    )

    title = factory.Sequence(
        lambda n: f"Evento {n}"
    )

    start = factory.LazyFunction(
        timezone.now
    )

    end = factory.LazyAttribute(
        lambda obj: obj.start + timedelta(hours=1)
    )

    color = "#3B82F6"