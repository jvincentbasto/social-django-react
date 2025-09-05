from django.urls import path
from ..views.entry import (
    get_posts,
    create_post,
    get_post_by_id,
    update_post,
    delete_post,
    toggle_post_like,
)

urlpatterns = [
    path("posts/", get_posts),
    path("post/create/", create_post),
    path("post/like/", toggle_post_like),
    # new
    path("post/<int:pk>/", get_post_by_id),
    path("post/<int:pk>/update/", update_post),
    path("post/<int:pk>/delete/", delete_post),
]
