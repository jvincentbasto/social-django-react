from django.urls import path
from ..views.entry import (
    get_user_profile,
    get_user_posts,
    toggle_user_follow,
    update_user_details,
    search_users,
)

urlpatterns = [
    path("user/<str:id>/", get_user_profile),
    path("user/posts/<str:id>/", get_user_posts),
    path("user/follow", toggle_user_follow),
    path("user/update", update_user_details),
    path("user/search", search_users),
]
