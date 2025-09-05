import os
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from ..models.entry import Post


@receiver(post_delete, sender=Post)
def delete_post_image(sender, instance, **kwargs):
    """Delete image file from filesystem when post is deleted"""
    if instance.image and instance.image.path:
        try:
            os.remove(instance.image.path)
        except FileNotFoundError:
            pass


@receiver(pre_save, sender=Post)
def delete_old_post_image(sender, instance, **kwargs):
    """Delete old image file when updating to a new one"""
    # Runs every time a Post is deleted, regardless of whether it’s through .delete() or QuerySet.delete().
    # More reliable, works for bulk deletes.
    if not instance.pk:
        return  # only run on update
    try:
        old_post = Post.objects.get(pk=instance.pk)
    except Post.DoesNotExist:
        return
    old_image = old_post.image
    new_image = instance.image
    if old_image and old_image != new_image:
        if old_image.path and os.path.isfile(old_image.path):
            os.remove(old_image.path)
