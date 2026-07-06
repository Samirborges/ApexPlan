from django.urls import path
from .views import ObjectiveListCreateView, ObjectiveDetailView

urlpatterns = [
    path(
        "", 
        ObjectiveListCreateView.as_view(), 
        name="objective-list-create"
    ),
    
    path(
        "<int:pk>/",
        ObjectiveDetailView.as_view(),
        name="objective-detail",
    )
]
