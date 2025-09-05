from django.urls import path
from ..views.entry import (
    register,
    verify_user_authentication,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    logout,
)

urlpatterns = [
    path("register/", register),
    path("verify_auth/", verify_user_authentication),
    path("logout/", logout),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
]
