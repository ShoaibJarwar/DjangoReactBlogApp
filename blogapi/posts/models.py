# from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# Create your models here.

# class User(AbstractUser):
#     bio = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return self.username

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

 
class Post(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    category = models.ForeignKey(Category, related_name='posts', on_delete=models.CASCADE)
    views = models.PositiveIntegerField(default=0)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="liked_posts", blank=True)
    published = models.BooleanField(default=False)
    on_created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    # image = models.ImageField(upload_to="posts/", null=True, blank=True)

    class Meta:
        ordering = ["-on_created"]
        verbose_name_plural = "Posts"
 
    def __str__(self):
        return self.title



class PostImage(models.Model):
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="posts/")

    def __str__(self):
        return f"Image for {self.post.title}"



class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        related_name="comments",
        on_delete=models.CASCADE
    )
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
  
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Comments by {self.author} on {self.post.title}" if self.author else f"Comments on {self.post.title}"