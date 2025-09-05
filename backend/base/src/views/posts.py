from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status

from ..models.entry import User, Post
from ..serializers.entry import (
    PostSerializer,
    PostWriteSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_posts(request):
    try:
        my_user = User.objects.get(username=request.user.username)
    except User.DoesNotExist:
        return Response({"Error": "User does not exist"})

    paginator = PageNumberPagination()
    paginator.page_size = 10
    posts = Post.objects.all().order_by("-created_at")

    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)

    data = []
    for post in serializer.data:
        new_post = {**post}
        new_post["liked"] = my_user.id in post["likes"]

        data.append(new_post)

    posts_by_page = paginator.get_paginated_response(data)
    return posts_by_page


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_post(request):
    try:
        data = request.data

        try:
            user = User.objects.get(username=request.user.username)
        except User.DoesNotExist:
            return Response({"Error": "User does not exist"})

        description = data.get("description", "")
        image = data.get("image", None)

        post = Post.objects.create(user=user, description=description, image=image)
        serializer = PostSerializer(post, many=False)

        return Response(serializer.data)
    except:
        return Response({"Error": "Failed to create post"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_post_by_id(request, pk):
    post = get_object_or_404(Post, pk=pk)
    serializer = PostSerializer(post)
    return Response(serializer.data)


@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_post(request, pk):
    post = get_object_or_404(Post, pk=pk)

    # ensure only owner can update
    if post.user != request.user:
        return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    # serializer = PostWriteSerializer(post, data=request.data, partial=True)
    serializer = PostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # return with read serializer so frontend sees full data
        return Response(PostSerializer(post).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_post(request, pk):
    post = get_object_or_404(Post, pk=pk)

    # ensure only owner can delete
    if post.user != request.user:
        return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

    post.delete()
    return Response({"success": "Post deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_post_like(request):
    try:
        try:
            post = Post.objects.get(id=request.data["id"])
        except Post.DoesNotExist:
            return Response({"Error": "Post does not exist"})

        try:
            user = User.objects.get(username=request.user.username)
        except User.DoesNotExist:
            return Response({"Error": "User does not exist"})

        has_liked = user in post.likes.all()
        if has_liked:
            post.likes.remove(user)
            values = {"liked": False}
        else:
            post.likes.add(user)
            values = {"liked": True}

        return Response(values)
    except:
        toggle_type = "unlike" if has_liked else "like"
        return Response({"Error": f"Failed to {toggle_type} post"})
