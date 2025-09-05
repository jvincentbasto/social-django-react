from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from ..models.entry import User
from ..serializers.entry import (
    UserSerializer,
    UserProfileSerializer,
    UserSearchSerializer,
    PostSerializer,
)


@api_view(["GET"])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])  # allow public access but still can access request.user
def get_user_profile(request, id):
    try:
        try:
            target_user = User.objects.get(username=id)
        except User.DoesNotExist:
            return Response({"Error": "User does not exist"}, status=404)

        # Check if the request user is authenticated
        my_user = request.user if request.user.is_authenticated else None

        following = False
        is_our_profile = False

        if my_user:
            following = my_user in target_user.followers.all()
            is_our_profile = my_user.username == target_user.username

        serializer = UserProfileSerializer(target_user, many=False)

        values = {
            **serializer.data,
            "following": following,
            "is_our_profile": is_our_profile,
        }
        return Response(values)

    except Exception as e:
        return Response(
            {"Error": "Failed to get user data", "details": str(e)}, status=500
        )


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_details(request):
    data = request.data

    try:
        user = User.objects.get(username=request.user.username)
    except User.DoesNotExist:
        return Response({"Error": "User does not exist"})

    serializer = UserSerializer(user, data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({**serializer.data, "success": True})

    return Response({**serializer.errors, "success": False})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.query_params.get("query", "")

    users = User.objects.filter(username__icontains=query)
    serializer = UserSearchSerializer(users, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_posts(request, id):
    try:
        my_user = User.objects.get(username=request.user.username)
        target_user = User.objects.get(username=id)
    except User.DoesNotExist:
        return Response({"Error": "User does not exist"})

    posts = target_user.posts.all().order_by("-created_at")
    serializer = PostSerializer(posts, many=True)

    data = []
    for post in serializer.data:
        new_post = {**post}
        new_post["liked"] = my_user.id in post["likes"]

        data.append(new_post)

    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_user_follow(request):
    try:
        try:
            my_user = User.objects.get(username=request.user.username)
            target_user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"Error": "Users does not exist"})

        has_followed = my_user in target_user.followers.all()
        if has_followed:
            target_user.followers.remove(my_user)
            values = {"following": False}
        else:
            target_user.followers.add(my_user)
            values = {"following": True}

        response = Response(values)
        return response
    except:
        follow_type = "unfollow" if has_followed else "follow"
        return Response({"Error": f"Failed to {follow_type} user"})
