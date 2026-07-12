from django.db import migrations


def fix_pending_status(apps, schema_editor):
    Goal = apps.get_model("goals", "Goal")

    Goal.objects.filter(
        status="PEDING"
    ).update(
        status="PENDING"
    )


def reverse_pending_status(apps, schema_editor):
    Goal = apps.get_model("goals", "Goal")

    Goal.objects.filter(
        status="PENDING"
    ).update(
        status="PEDING"
    )


class Migration(migrations.Migration):

    dependencies = [
        ("goals", "0003_alter_goal_status"),
    ]

    operations = [
        migrations.RunPython(
            fix_pending_status,
            reverse_pending_status,
        ),
    ]