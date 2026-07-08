from rest_framework import serializers

from goals.models import Goal
from .models import CalendarEvent
from .services import CalendarService


class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = [
            "id",
            "goal",
            "title",
            "start",
            "end",
            "color",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
        
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:
            self.fields["goal"].queryset = Goal.objects.filter(
                objective__user=request.user
            )
    

    def create(self, validated_data):
        request = self.context["request"]

        return CalendarService.create(
            user=request.user,
            goal=validated_data.get("goal"),
            title=validated_data["title"],
            start=validated_data["start"],
            end=validated_data["end"],
            color=validated_data.get("color", "#3B82F6"),
        )

    def update(self, instance, validated_data):
        return CalendarService.update(
            event=instance,
            goal=validated_data.get("goal"),
            title=validated_data.get("title", instance.title),
            start=validated_data.get("start", instance.start),
            end=validated_data.get("end", instance.end),
            color=validated_data.get("color", instance.color),
        )