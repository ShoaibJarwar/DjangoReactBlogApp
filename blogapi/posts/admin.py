from django.contrib import admin
from .models import Post, Category, Comment, PostImage

# Register your models here.
# admin.site.register(User)
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Category)
admin.site.register(Comment)