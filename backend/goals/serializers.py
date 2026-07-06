from rest_framework import serializers

from objectives.models import Objective
from .models import Goal
from .services import GoalService

class GoalSerializer(serializers.ModelSerializer):

    objective = serializers.PrimaryKeyRelatedField(
        queryset=Objective.objects.all()
    )

    class Meta:

        model = Goal

        fields = (
            "id",
            "objective",
            "title",
            "description",
            "estimated_days",
        )

        read_only_fields = (
            "id",
        )

    
    def create(self, validated_data):
        
        return GoalService.create(
            objective=validated_data["objective"],
            title=validated_data["title"],
            description=validated_data.get("description", ""),
            estimated_days=validated_data["estimated_days"],
        )
    
