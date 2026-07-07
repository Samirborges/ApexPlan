from rest_framework import serializers

from .models import Objective
from .services import ObjectiveService

class ObjectiveSerializer(serializers.ModelSerializer):
    
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    ) 
    
    class Meta:
        model = Objective
        
        fields = (
            "id",
            "title",
            "description",
            "start_date",
            "user"
        )
        
        read_only_fields = (
            "id",
        )
        
    
    def create(self, validated_data):
        
        return ObjectiveService.create(
            user=validated_data["user"],
            title=validated_data["title"],
            start_date=validated_data["start_date"],
            description=validated_data.get("description", "")
        )
        
    def update(self, instance, validated_data):
        
        return ObjectiveService.update(
            objective=instance,
            title=validated_data.get("title", instance.title),
            description=validated_data.get(
                "description",
                instance.description,
            ),
            start_date=validated_data.get(
                "start_date",
                instance.start_date,
            )
        )
        