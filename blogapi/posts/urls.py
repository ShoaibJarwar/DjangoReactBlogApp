from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CategoryViewSet, DashboardView, CommentViewSet, generate_post
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'posts', PostViewSet, basename="post")
router.register(r'categories', CategoryViewSet, basename="category")
router.register(r'comments', CommentViewSet, basename="comments")

urlpatterns = [
    path('', include(router.urls)),
    # path('auth/register', RegisterView.as_view(), name="register"),
    # path('auth/login', TokenObtainPairView.as_view(), name="token-obtain-pair"),
    # path('auth/refresh', TokenRefreshView.as_view(), name="token-refresh"),
    path('dashboard/',DashboardView.as_view(), name="dashboard"),
    path('ai/generate/', generate_post, name="ai-generate" ),
]