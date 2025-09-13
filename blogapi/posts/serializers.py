from rest_framework import serializers
from .models import Post, Category, Comment, PostImage
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class RegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields  = ("username", "email", "password")

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data["username"],
#             email=validated_data.get("email"),
#             password=validated_data["password"]
#         )
#         return user


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ["id", "name", "post_count"]
    
    def get_post_count(self, obj):
        return obj.posts.count()

class ReplySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "text", "created_at"]

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    class Meta:
        model = Comment
        fields = ["id", "post", "author", "text", "created_at", "replies", "parent"]
        read_only_fields = ["author"]

    # def create(self, validated_data):
    #     request = self.context.get("request")
    #     user = request.user
    #     comment = Comment.objects.create(author=user, **validated_data)
    #     return comment

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "image"]
        

class PostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source = "category.name", read_only=True)
    comment_count = serializers.SerializerMethodField(source = "comments.count", read_only=True)
    author = serializers.StringRelatedField(read_only=True)
    likes_count = serializers.SerializerMethodField()
    liked_by = serializers.SerializerMethodField()

    # category = CategorySerializer(read_only=True)
    comments = CommentSerializer(many=True,read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
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
            "comments",
            "images",
            "category_name",
            "comment_count",
            "likes_count",
            "liked_by",
        ]
    def get_comment_count(self, obj):
        return obj.comments.count()
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_liked_by(self, obj):
        request = self.context.get("request")
        # if request:
        #     print("DEBUG -> user:", request.user, "likes:", list(obj.likes.values_list("id", flat=True)))
        if request and request.user.is_authenticated:
            return obj.likes.filter(pk=request.user.pk).exists()
        return False
    
