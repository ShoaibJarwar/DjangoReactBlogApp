from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # password2 = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    # profile_picture = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "bio", "profile_picture")

    # def get_profile_picture(self, obj):
    #     request = self.context.get("request")
    #     if obj.profile_picture and hasattr(obj.profile_picture, 'url'):
    #         return request.build_absolute_uri(obj.profile_picture.url)
    #     return None

 

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True,validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    email = serializers.EmailField(
            required =True,
            validators = [UniqueValidator(queryset=User.objects.all())],
        )
    
    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email", "password", "password2", "bio", "profile_picture")

        

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs
    
    def create(self, validated_data):
        # user = CustomUser.objects.create(
        #     username = validated_data["username"],
        #     email = validated_data["email"]
        # )

        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data