from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models.entry import User
from ..serializers.entry import (
    UserRegisterSerializer,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


@api_view(["POST"])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_user_authentication(request):
    return Response({"authenticated": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        response = Response()
        response.data = {"success": True}

        # delete cookies
        response.delete_cookie("access_token", path="/", samesite="None")
        response.delete_cookie("refresh_token", path="/", samesite="None")

        return response
    except:
        return Response({"success": False})


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            # generate tokens
            responseTokens = super().post(request, *args, **kwargs)
            tokens = responseTokens.data
            access_token = tokens["access"]
            refresh_token = tokens["refresh"]

            # verify user
            username = request.data["username"]
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"Error": "User does not exist"})

            # response values
            response = Response()
            response.data = {
                "success": True,
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "profile_image": (
                        user.profile_image.url if user.profile_image else None
                    ),
                    "bio": user.bio,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                },
            }

            # set tokens
            cookie_options = {
                "httponly": True,
                "secure": True,
                "samesite": "None",
                "path": "/",
            }
            response.set_cookie(
                key="access_token", value=access_token, **cookie_options
            )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                **cookie_options,
            )

            return response
        except:
            return Response({"success": False})


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            # set token payload
            refresh_token = request.COOKIES.get("refresh_token")
            request.data["refresh"] = refresh_token

            # get new tokens
            responseTokens = super().post(request, *args, **kwargs)
            tokens = responseTokens.data
            access_token = tokens["access"]

            # response values
            response = Response()
            response.data = {"success": True}

            # set tokens
            cookie_options = {
                "httponly": True,
                "secure": True,
                "samesite": "None",
                "path": "/",
            }
            response.set_cookie(
                key="access_token", value=access_token, **cookie_options
            )

            return response
        except:
            return Response({"success": False})
