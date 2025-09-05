from django.contrib import admin
from .src.models.entry import User, Post

admin.site.register(User)
admin.site.register(Post)
