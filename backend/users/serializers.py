from rest_framework import serializers

from .models import User
from .services import UserService

class RegisterSerializer(serializers.ModelSerializer):
    
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
                    "confirm_password": "Password do not match."
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
        
    