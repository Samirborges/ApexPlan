from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema

from django.conf import settings

@extend_schema(
    tags=["System"],
    summary="Health Check",
    description="Checks whether the API is running.",
)
class HealthCheckView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        return Response({
            "status": "ok",
            "application": "ApexPlan API",
            "version": settings.SPECTACULAR_SETTINGS["VERSION"],
            "debug": settings.DEBUG,
        })