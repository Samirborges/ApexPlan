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
            "status",
            "order_index",
            "estimated_days",
            "extra_days",
            "start_date",
            "end_date",
            "is_completed"
        )

        read_only_fields = (
            "id",
            "status",
            "order_index",
            "start_date",
            "end_date",
        )
        
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")

        if request:
            self.fields["objective"].queryset = (
                Objective.objects.filter(
                    user=request.user
                )
            )

        # Durante a criação (POST), is_completed é somente leitura
        if self.instance is None:
            self.fields["is_completed"].read_only = True
            

    
    def create(self, validated_data):
        
        return GoalService.create(
            user=self.context["request"].user,
            objective=validated_data["objective"],
            title=validated_data["title"],
            description=validated_data.get("description", ""),
            estimated_days=validated_data["estimated_days"],
        )
    
    
    def update(self, instance, validated_data):
        return GoalService.update(
            goal=instance,
            title=validated_data.get("title", instance.title),
            description=validated_data.get("description", instance.description,),
            estimated_days=validated_data.get("estimated_days", instance.estimated_days,),
            extra_days=validated_data.get("extra_days", instance.extra_days,),
            is_completed=validated_data.get("is_completed", instance.is_completed),
        )
