import os
from django.db import models
from .user import User


class Post(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="posts",
    )
    description = models.CharField(max_length=400)
    likes = models.ManyToManyField(
        User,
        related_name="liked_posts",
        blank=True,
    )
    image = models.ImageField(upload_to="galery/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # def delete(self, *args, **kwargs):
    #     # delete file from storage
    #     # Runs only if you explicitly call post.delete() in Python code.
    #     # Safe for single-object deletions, but not reliable for bulk deletes.
    #     if self.image and os.path.isfile(self.image.path):
    #         os.remove(self.image.path)
    #     super().delete(*args, **kwargs)

    # many to one
    # posts -> post.user
    # user -> user.posts.all()

    # many to many
    # likes -> post.likes.all()
    # liked_posts -> user.liked_posts.all()

    def __str__(self):
        return f"{self.user} - {self.description}"
