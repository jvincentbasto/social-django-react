from django.conf import settings
from django.conf.urls.static import static

from .auth import urlpatterns as auth_urls
from .users import urlpatterns as user_urls
from .posts import urlpatterns as post_urls

urlpatterns = [
    *auth_urls,
    *user_urls,
    *post_urls,
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
