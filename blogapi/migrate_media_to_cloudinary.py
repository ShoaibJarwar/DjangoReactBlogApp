import os
import django
import cloudinary.uploader

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blogapi.settings")
django.setup()

from posts.models import PostImage

def migrate_images():
    images = PostImage.objects.exclude(image="")
    for img in images:
        try:
            local_path = img.image.path
            if not os.path.exists(local_path):
                print(f"⚠️ File not found: {local_path}, skipping...")
                continue

            print(f"Uploading: {local_path}")
            upload_result = cloudinary.uploader.upload(local_path)

            img.image = upload_result["secure_url"]
            img.save(update_fields=["image"])
            print(f"✅ Updated {img.post.title} -> {img.image}")

        except Exception as e:
            print(f"❌ Error with {img.post.title}: {e}")

if __name__ == "__main__":
    migrate_images()
