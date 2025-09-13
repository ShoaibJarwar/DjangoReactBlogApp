"""
Django settings for blogapi project (Production).
"""

from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import timedelta

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Secret & Debug
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-secret-key")  
DEBUG = os.getenv("DJANGO_DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "djangoreactblogapp-production.up.railway.app").split(",")

# CSRF / Cookies Security
CSRF_TRUSTED_ORIGINS = [
    "https://djangoreactblogapp-production.up.railway.app",
    "http://localhost:3001",  # React dev server (optional)
]
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# Installed Apps 
INSTALLED_APPS = [
    "corsheaders",
    "posts",
    "accounts",
    "cloudinary_storage",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "cloudinary",
    
]
 
# Middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "blogapi.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "blogapi.wsgi.application"

# Database (Railway/Postgres via dj-database-url, fallback to SQLite)
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}", conn_max_age=600
    )
}

# Password Validators
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'dvevnwbxa',
    'API_KEY': '497885947883491',
    'API_SECRET': 'iLUcKtoy1VeGpC0HvSu0fzAFCuQ',
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage' 

 
# Static & Media (Production with WhiteNoise)
# MEDIA_URL = "/media/"
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST Framework 
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
} 
 
# JWT Config
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "https://your-netlify-site.netlify.app",  # replace with your Netlify frontend
    "http://localhost:3001",                 # local React dev
]

# Custom User Model
AUTH_USER_MODEL = "accounts.CustomUser"
