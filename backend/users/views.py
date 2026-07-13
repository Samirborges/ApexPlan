from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from typing import cast
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer

class RegisterView(generics.CreateAPIView):
    
    permission_classes = []

    authentication_classes = []
    
    queryset = User.objects.all()
    
    serializer_class = RegisterSerializer
    

class LoginView(generics.GenericAPIView):

    serializer_class = LoginSerializer
    
    permission_classes = []

    authentication_classes = []

    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        validated_data = cast(dict, serializer.validated_data)

        user = validated_data["user"]

        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK
        )


class MeView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        serializer = UserSerializer(request.user)
        
        return Response(serializer.data)
    

class PasswordResetRequestView(generics.GenericAPIView):

    serializer_class = PasswordResetRequestSerializer

    permission_classes = []

    authentication_classes = []

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "detail": (
                    "If an account with this email exists, "
                    "a password reset link has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(generics.GenericAPIView):

    serializer_class = PasswordResetConfirmSerializer

    permission_classes = []

    authentication_classes = []

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "detail": "Password reset successfully."
            },
            status=status.HTTP_200_OK,
        )

  