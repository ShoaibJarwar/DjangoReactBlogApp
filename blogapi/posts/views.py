from django.shortcuts import render
from django.contrib.auth import get_user_model 
from rest_framework import viewsets, generics, permissions
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import PostSerializer, RegisterSerializer, CategorySerializer
from .models import Post, Category

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

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
        queryset = Post.objects.all()
        category_id = self.request.query_params.get("category")

        if(category_id):
            queryset = queryset.filter(category_id=category_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]