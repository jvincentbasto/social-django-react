from rest_framework import serializers
from ..models.entry import User, Post


class PostSerializer(serializers.ModelSerializer):

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ["username", "profile_image"]

    # user = UserSerializer(read_only=True)
    user = serializers.SerializerMethodField()
    # image = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    like_users = serializers.SerializerMethodField()
    formatted_created_at = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "description",
            "likes",
            "image",
            "created_at",
            "updated_at",
            # custom
            "username",
            "like_count",
            "like_users",
            "formatted_created_at",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["image"] = instance.image.url if instance.image else None
        return rep

    def get_user(self, obj):
        values = {
            "username": obj.user.username,
            "profile_image": (
                obj.user.profile_image.url if obj.user.profile_image else None
            ),
        }
        return values

    # def get_image(self, obj):
    #     return obj.image.url if obj.image else None

    def get_username(self, obj):
        return obj.user.username

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_like_users(self, obj):
        def get_values(user):
            values = {
                "username": user.username,
                "profile_image": user.profile_image.url if user.profile_image else None,
            }

            return values

        return [get_values(user) for user in obj.likes.all()]

    def get_formatted_created_at(self, obj):
        return obj.created_at.strftime("%d %b %y")


class PostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["description", "image"]  # only updatable fields


__all__ = ["PostSerializer", "PostWriteSerializer"]
