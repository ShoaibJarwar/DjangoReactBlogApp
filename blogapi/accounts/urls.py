from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MyTokenObtainPairView, MyTokenRefreshView, LogoutView, MeView, ProfileView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name="signup"),
    path('login/', MyTokenObtainPairView.as_view(), name="login"),
    path('token/refresh/', MyTokenRefreshView.as_view(), name="token-refresh"),
    path('me/', MeView.as_view(),name="me"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('profile/', ProfileView.as_view(), name="profile"),
]
