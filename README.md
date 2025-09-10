# 📰 Blog App (Django + React)

A full-stack blog application built with **Django REST Framework (DRF)** for the backend and **React** for the frontend.  
It includes **authentication, posts, categories, likes, comments, and a personal dashboard**.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login & signup  
- Protected API endpoints (posts, dashboard, likes, etc.)  
- User-specific actions (like `my_posts`)  

### 📝 Posts
- Create, edit, and delete posts  
- Assign posts to categories  
- Upload optional post images  
- Pagination & filtering by category  
- Show author details  
- Track **views, likes, and comment counts**  
- `liked_by` flag so the frontend knows if the current user liked a post  

### ❤️ Likes
- Toggle like/unlike a post  
- Show total `likes_count` per post  
- `liked_by` updates instantly in the UI  

### 💬 Comments
- Add comments on posts  
- Fetch comments dynamically  
- Display total `comment_count` per post  

### 📊 Dashboard
- User’s own posts (`/posts/my_posts/`)  
- Aggregated stats for admins/authors  
- Category-wise filtering  

### 🖥️ Frontend (React)
- Built with **React + Context API** for auth state  
- Components:   
- Integrated with backend via a centralized API layer (`api.js`)  
- Toast notifications for feedback  
- Responsive UI  

---

## 🛠️ Tech Stack

**Backend**
- Python  
- Django  
- Django REST Framework  
- SimpleJWT (for JWT auth)  
- SQLite  

**Frontend**
- React   
- Context API  
- Fetch API for requests  
- React-Toastify for notifications  

---

## ⚙️ Installation

### Backend (Django)
```bash
# Clone repo
git clone https://github.com/yourusername/blog-app.git
cd blog-app/blogapi


# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver


# React Frontend

cd ../blog-frontend

# Install dependencies
npm install

# Start development server
npm start


---

## 🔑 API Endpoints

### 🛡️ Authentication
| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | `/api/token/`             | Get access & refresh tokens  |
| POST   | `/api/token/refresh/`     | Refresh access token         |

### 📝 Posts
| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/posts/`                   | List all posts                     |
| GET    | `/api/posts/?category=<id>`     | Filter posts by category           |
| POST   | `/api/posts/`                   | Create new post (**auth required**) |
| PUT    | `/api/posts/<id>/`              | Update post (**author only**)      |
| DELETE | `/api/posts/<id>/`              | Delete post (**author only**)      |
| POST   | `/api/posts/<id>/like/`         | Toggle like/unlike                 |
| GET    | `/api/posts/my_posts/`          | List posts of current user         |

### 💬 Comments
| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/comments/?post=<id>`   | List comments of a post   |
| POST   | `/api/comments/`             | Add comment to a post     |

### 📊 Dashboard
| Method | Endpoint          | Description                                  |
|--------|------------------|----------------------------------------------|
| GET    | `/api/dashboard/` | Fetch aggregated dashboard stats (**auth required**) |

---

## 📌 Roadmap

- ✅ **Likes & Comments** – toggle like/unlike, add comments  
- ✅ **User Dashboard** – personal stats, my_posts, top categories  
- ⏳ **Post Search & Sorting** – keyword search, newest/oldest sorting  
- ⏳ **Profile Page with Avatar** – user profile & picture upload  

---

## 📝 License

This project is licensed under the **MIT License**.  
You are free to **use, modify, and distribute** this project as you wish.  
