from django.contrib.auth import get_user_model
from rest_framework import serializers

from typing import Any, cast

from .models import User
from .services import UserService
from .emails import PasswordResetEmailService
from .tokens import PasswordResetService

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    
    email = serializers.EmailField(required=True)
    
    confirm_password = serializers.CharField(
        write_only=True
    )
    
    class Meta:
        
        model = User
        
        fields = (
            "username",
            "email",
            "password",
            "confirm_password"
        )
        
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }
        
    
    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {
                    "confirm_password": "Passwords do not match."
                }
            )    
            
        return attrs
        
        
    def create(self, validated_data):
        """
        Creates a new user using the create_user method,
        ensuring that the password is stored securely.
        """
        
        validated_data.pop("confirm_password")
        
        return UserService.register(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        

class LoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField()   
    password = serializers.CharField(write_only=True)

    
    def validate(self, attrs):
        
        
        user = UserService.authenticate_user(
            email=attrs["email"],
            password=attrs["password"],
        )
        
        attrs["user"] = user
        
        return attrs
    

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer responsible for returning the authenticated user's data.
    """
    
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
        )


class PasswordResetRequestSerializer(serializers.Serializer):

    email = serializers.EmailField()
    
    def save(self):

        validate_data = cast(dict[str, Any], self.validated_data)
        
        email = validate_data["email"]

        try:
            user = User.objects.get(email=email)

            uid, token = PasswordResetService.generate(user)
            
            PasswordResetEmailService.send(
                user=user,
                uid=uid,
                token=token,
            )
            

        except User.DoesNotExist:
            pass

        return {}
    
    
class PasswordResetConfirmSerializer(serializers.Serializer):

    uid = serializers.CharField()

    token = serializers.CharField()

    password = serializers.CharField(
        min_length=8,
        write_only=True,
    )

    def validate(self, attrs):

        user = PasswordResetService.validate(
            attrs["uid"],
            attrs["token"],
        )
        
        if user is None:
            raise serializers.ValidationError(
                {
                    "token": "Invalid or expired token."
                }
            )
            
        attrs["user"] = user
    
        user = PasswordResetService.validate(
            attrs["uid"],
            attrs["token"],
        )
        
        return attrs
    
    
    def save(self):
        
        validated_data = cast(dict[str, Any], self.validated_data)

        user = validated_data["user"]

        password = validated_data["password"]

        user.set_password(password)

        user.save(
            update_fields=["password"]
        )

        return user

    