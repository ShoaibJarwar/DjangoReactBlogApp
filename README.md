📰 Blog App (Django + React)

A full-stack blog application built with Django REST Framework (DRF) for the backend and React for the frontend.
It includes authentication, posts, categories, likes, comments, and a personal dashboard.

🚀 Features
🔐 Authentication

JWT-based login & signup

Protected API endpoints (posts, dashboard, likes, etc.)

User-specific actions (like my_posts)

📝 Posts

Create, edit, and delete posts

Assign posts to categories

Upload optional post images

Pagination & filtering by category

Show author details

Track views, likes, and comment counts

liked_by flag so the frontend knows if the current user liked a post

❤️ Likes

Toggle like/unlike a post

Show total likes_count per post

liked_by updates instantly in the UI

💬 Comments

Add comments on posts

Fetch comments dynamically

Display total comment_count per post

📊 Dashboard

User’s own posts (/posts/my_posts/)

Aggregated stats for admins/authors

Category-wise filtering

🖥️ Frontend (React)

Built with React + Context API for auth state

Components:

Posts.js → Fetch and list posts with category filtering

PostList.js → Renders list of posts

PostItem.js → Individual post item with likes, comments, edit, and delete

Integrated with backend via a centralized API layer (api.js)

Toast notifications for feedback

Responsive UI

🛠️ Tech Stack

Backend

Python 3.11+

Django 5.x

Django REST Framework

SimpleJWT (for JWT auth)

PostgreSQL / SQLite (configurable)

Frontend

React 18+

Context API

Fetch API for requests

React-Toastify for notifications

⚙️ Installation
Backend (Django)
# Clone repo
git clone https://github.com/yourusername/blog-app.git
cd blog-app/backend

# Setup virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver

Frontend (React)
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start

🔑 API Endpoints
Authentication

POST /api/token/ → Get access & refresh tokens

POST /api/token/refresh/ → Refresh access token

Posts

GET /api/posts/ → List all posts

GET /api/posts/?category=<id> → Filter posts by category

POST /api/posts/ → Create new post (auth required)

PUT /api/posts/<id>/ → Update post (author only)

DELETE /api/posts/<id>/ → Delete post (author only)

POST /api/posts/<id>/like/ → Toggle like/unlike

GET /api/posts/my_posts/ → List posts of current user

Comments

GET /api/comments/?post=<id> → List comments of a post

POST /api/comments/ → Add comment to a post

Dashboard

GET /api/dashboard/ → Fetch aggregated dashboard stats (auth required)

📷 Screenshots:
![alt text](image.png)

📌 Roadmap

✅ Likes & comments

✅ User dashboard

⏳ Post search & sorting

⏳ Profile page with avatar

📝 License

MIT License. Free to use and modify.