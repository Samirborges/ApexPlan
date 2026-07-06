from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Goal
from .serializers import GoalSerializer

class GoalListCreateView(generics.ListCreateAPIView):

    serializer_class = GoalSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(
            objective__user=self.request.user
        ).order_by(
            "objective",
            "order_index",
        )
        
        
class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(
            objective__user=self.request.user
        )