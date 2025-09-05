from rest_framework import serializers
from ..models.entry import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        # fields = "__all__"
        fields = [
            "username",
            "email",
            "profile_image",
            "first_name",
            "last_name",
            "bio",
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    user_followers = serializers.SerializerMethodField()
    user_following = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_image",
            "bio",
            "follower_count",
            "following_count",
            "user_followers",
            "user_following",
        ]

    def get_profile_image(self, obj):
        return obj.profile_image.url if obj.profile_image else None

    def get_user_followers(self, obj):
        def get_values(user):
            values = {
                "username": user.username,
                "profile_image": user.profile_image.url if user.profile_image else None,
            }

            return values

        return [get_values(user) for user in obj.followers.all()]

    def get_user_following(self, obj):
        def get_values(user):
            values = {
                "username": user.username,
                "profile_image": user.profile_image.url if user.profile_image else None,
            }

            return values

        return [get_values(user) for user in obj.following.all()]

    def get_follower_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()


class UserSearchSerializer(serializers.ModelSerializer):
    # profile_image = serializers.SerializerMethodField()
    user_followers = serializers.SerializerMethodField()
    user_following = serializers.SerializerMethodField()
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    formatted_created_at = serializers.SerializerMethodField()

    class Meta:
        model = User
        # fields = "__all__"
        fields = [
            "username",
            "email",
            "profile_image",
            "first_name",
            "last_name",
            "bio",
            # "created_at",
            "updated_at",
            #
            "user_followers",
            "user_following",
            "follower_count",
            "following_count",
            # custom
            "formatted_created_at",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["profile_image"] = (
            instance.profile_image.url if instance.profile_image else None
        )
        return rep

    # def get_profile_image(self, obj):
    #     return obj.profile_image.url if obj.profile_image else None

    def get_user_followers(self, obj):
        def get_values(user):
            values = {
                "username": user.username,
                "profile_image": user.profile_image.url if user.profile_image else None,
            }

            return values

        return [get_values(user) for user in obj.followers.all()]

    def get_user_following(self, obj):
        def get_values(user):
            values = {
                "username": user.username,
                "profile_image": user.profile_image.url if user.profile_image else None,
            }

            return values

        return [get_values(user) for user in obj.following.all()]

    def get_follower_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_formatted_created_at(self, obj):
        return obj.created_at.strftime("%d %b %y")


__all__ = ["UserSerializer", "UserProfileSerializer", "UserSearchSerializer"]
