from rest_framework import generics
from rest_framework.permissions import IsAuthenticated


from .serializers import ObjectiveSerializer
from .models import Objective

class ObjectiveListCreateView(generics.ListCreateAPIView):

    serializer_class = ObjectiveSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return only the authenticated user's objectives.
        """
        
        return Objective.objects.filter(user=self.request.user).order_by("start_date")


class ObjectiveDetailView(generics.RetrieveUpdateDestroyAPIView):
    
    serializer_class = ObjectiveSerializer
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        
        return Objective.objects.filter(user=self.request.user) 
    