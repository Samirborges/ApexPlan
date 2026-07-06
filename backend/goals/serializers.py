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
        
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:
            self.fields["objective"].queryset = Objective.objects.filter(
                user=request.user
            )

    
    def create(self, validated_data):
        
        return GoalService.create(
            user=self.context["request"].user,
            objective=validated_data["objective"],
            title=validated_data["title"],
            description=validated_data.get("description", ""),
            estimated_days=validated_data["estimated_days"],
        )
    
