from rest_framework import serializers
from .models import Post, Category
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields  = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )
        return user

class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source = "category.name", read_only=True)
    comment_count = serializers.IntegerField(source = "comments.count", read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Post
        # fields = '__all__'
        fields = [
            "id",
            "title",
            "content",
            "views",
            "likes",
            "published",
            "on_created",
            "author",
            "category",
            "category_name",
            "comment_count",
        ]

    def get_comment_count(self, obj):
        return obj.comments.count()


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(source="posts.count", read_only=True)
    class Meta:
        model = Category
        fields = ["id", "name", "post_count"]