import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from ..models.entry import User


@receiver(post_delete, sender=User)
def delete_user_profile_image(sender, instance, **kwargs):
    """Delete profile image file from filesystem when user is deleted"""
    if instance.profile_image and instance.profile_image.path:
        try:
            os.remove(instance.profile_image.path)
        except FileNotFoundError:
            pass


@receiver(pre_save, sender=User)
def delete_old_user_profile_image(sender, instance, **kwargs):
    """Delete old profile image file when updating to a new one"""
    if not instance.pk:
        return  # only run on update

    try:
        old_user = User.objects.get(pk=instance.pk)
    except User.DoesNotExist:
        return

    old_image = old_user.profile_image
    new_image = instance.profile_image

    if old_image and old_image != new_image:
        if old_image.path and os.path.isfile(old_image.path):
            os.remove(old_image.path)
