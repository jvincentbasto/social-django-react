from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    bio = models.CharField(max_length=500)
    profile_image = models.ImageField(upload_to="profile_image/", blank=True, null=True)
    followers = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="following",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # many to many
    # followers -> user.followers.all() (users[]) -> A User has followers | (others follows user)
    # following -> user.following.all() (users[]) -> Users that a User follows | (user follows others)

    def __str__(self):
        return self.username
