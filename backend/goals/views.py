from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.contrib.auth.models import AnonymousUser

from .models import Goal
from .serializers import GoalSerializer


@extend_schema_view(
    get=extend_schema(
        responses=GoalSerializer(many=True),
    ),
    post=extend_schema(
        request=GoalSerializer,
        responses=GoalSerializer,
    ),
)
class GoalListCreateView(generics.ListCreateAPIView):

    queryset = Goal.objects.all()

    serializer_class = GoalSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(
            objective__user=self.request.user
        ).order_by(
            "objective",
            "order_index",
        )
               
@extend_schema_view(
    get=extend_schema(
        responses=GoalSerializer,
    ),
    put=extend_schema(
        request=GoalSerializer,
        responses=GoalSerializer,
    ),
    patch=extend_schema(
        request=GoalSerializer,
        responses=GoalSerializer,
    ),
)
class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        if not self.request.user.is_authenticated:
            return Goal.objects.none()
        
        return Goal.objects.filter(
            objective__user=self.request.user
        ).order_by(
            "objective",
            "order_index",
        )
        
