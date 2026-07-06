from django.urls import path
from .views import ObjectiveListCreateView

urlpatterns = [
    path(
        "", 
        ObjectiveListCreateView.as_view(), 
        name="objective-list-create"
    ),
    
    path(
        "<int:pk>/",
        ObjectiveListCreateView.as_view(),
        name="objective-detail",
    )
]
