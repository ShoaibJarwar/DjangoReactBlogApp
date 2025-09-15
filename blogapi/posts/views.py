from django.shortcuts import render
# from django.contrib.auth import get_user_model 
import os
from openai import OpenAI
from dotenv import load_dotenv
from rest_framework import viewsets, generics, permissions, status 
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Value
from django.db.models.functions import Coalesce
from .serializers import PostSerializer, CategorySerializer, CommentSerializer
from .models import Post, Category, Comment, PostImage

load_dotenv()
client = OpenAI(api_key = os.getenv("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"))

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_post(request):
    prompt = request.data.get("prompt", "")

    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # you can switch to gpt-4 or gpt-3.5
            messages=[
                {"role": "system", "content": "You are a helpful AI that writes blog posts."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.7,
        )
        content = response.choices[0].message.content
        return Response({"generated_text": content})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
    

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    # queryset = Post.objects.all() 
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        queryset = Post.objects.select_related("author", "category").prefetch_related("comments")
        category_id = self.request.query_params.get("category")
        # author_id = self.request.query_params.get("author")

        if(category_id):
            queryset = queryset.filter(category_id=category_id)
        # if(author_id == self.request.user):
        #     queryset = queryset.filter(author_id=author_id)
         
        return queryset


    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        
        for img in self.request.FILES.getlist("images"):
            PostImage.objects.create(post=post, image=img)
            
    def perform_update(self, serializer):
        post = serializer.save()
         
        ids_to_delete = self.request.data.getlist("imagesToDelete")
        if ids_to_delete:
            PostImage.objects.filter(id__in=ids_to_delete, post=post).delete()

        # If new images were uploaded in PATCH request
        if self.request.FILES.getlist("images"):
            for img in self.request.FILES.getlist("images"):
                PostImage.objects.create(post=post, image=img)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def my_posts(self, request):
        user_posts = Post.objects.filter(author=self.request.user)
        serializer = self.get_serializer(user_posts, many=True) 
        return Response(serializer.data) 
    
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Toggle like/unlike on a post"""
        post = self.get_object()
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            liked = False
        else:
            post.likes.add(user)
            liked = True

        return Response({
            "liked": liked,
            "likes_count": post.likes.count(),
        }, status=status.HTTP_200_OK)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.request.query_params.get("post")
        queryset = Comment.objects.filter(post=post_id)
        return queryset
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class DashboardView(APIView):
    """
    Returns aggregates & snippets for authenticated user's dashboard.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_posts = Post.objects.filter(author=user)
        # user_categories = (Category.objects.filter(posts__author=user).annotate(post_count=Count("posts")))

        # per_post = user_posts.annotate(comment_count=Count("comments"))

        # aggregates = per_post.aggregate(
        #     total_posts = Count("id"),
        #     total_likes = Coalesce(Sum("likes"), Value(0)),
        #     total_views = Coalesce(Sum("views"), Value(0)),
        #     total_comments = Coalesce(Count("comment_count"), Value(0)),
        # )

        per_post = user_posts.annotate(like_count=Count("likes"))

        posts_aggs = per_post.aggregate( 
            total_posts = Count("id", distinct=True),
            # total_likes = Coalesce(Count("likes", distinct=True), Value(0)),
            total_likes = Coalesce(Sum("like_count"), Value(0)),
            total_views = Coalesce(Sum("views"), Value(0)),
            # total_comments = Coalesce(Count("comments"), Value(0)),
        )

        total_comments = Comment.objects.filter(post__in=user_posts).count()

        aggregates = {
            "total_posts": posts_aggs["total_posts"],
            "total_likes": posts_aggs["total_likes"],
            "total_views": posts_aggs["total_views"],
            "total_comments": total_comments, 
        }

        # top_categories = (
        #     user_categories.values("id", "name")
        #     .annotate(count=Count("posts"))
        #     .order_by("-count")[:5]
        # )

        top_categories = (
            Category.objects
                .filter(posts__author = user)
                .annotate(post_count=Count("posts"))
                .order_by("-post_count")[:5]
                .values("id", "name", "post_count") 
        )

        recent_post_qs = user_posts.order_by("-on_created")[:5]
        recent_posts = PostSerializer(recent_post_qs, many=True, context={'request': request}).data
 
        return Response({
            "stats": aggregates,
            "top_categories": list(top_categories), 
            "recent_posts": recent_posts,
        })
    