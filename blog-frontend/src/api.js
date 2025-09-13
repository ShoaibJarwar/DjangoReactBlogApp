import { toast } from "react-toastify";
import axios from "axios";

const API = axios.create({
  baseURL: "https://djangoreactblogapp-production.up.railway.app/api",
  // baseURL: "http://127.0.0.1:8000/api",
});

const API_URL = "https://djangoreactblogapp-production.up.railway.app/api";
// const API_URL = "http://127.0.0.1:8000/api";

export async function registerUser(formData) {
  const res = await API.post("/accounts/signup/", formData, {
    headers: { "content-type": "multipart/form-data" },
  });
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data.user;
}

export async function loginUser(username, password) {
  const res = await API.post("/accounts/login/", { username, password });
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data.user;
}

export const me = async () => {
  const access = localStorage.getItem("access");
  const res = await API.get("/accounts/me/", {
    headers: { Authorization: `Bearer ${access}` },
  });
  return res.data;
};

export async function fetchPosts(token, categoryId = null) {
  let url = `${API_URL}/posts/`;
  if (categoryId) {
    url += `?category=${categoryId}`;
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // if(!res.ok) throw new Error("Failed to fetch posts.");
  if (!res.ok) toast.error("Failed to fetch posts");
  return res.json();
}

export async function createPost(token, postData) {
  const options =  {
    method: "POST",
    headers: {
      // "content-type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: postData,
  };

  if(!(postData instanceof FormData)){
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(postData);
  }

  const res = await fetch(`${API_URL}/posts/`, options);
  return res.json();
}

export async function updatePost(token, id, updatedData) {
  const options = {
    method: "PATCH",
    headers:{
      Authorization:`Bearer ${token}`,
    },
  };

  if(updatedData instanceof FormData){
    options.body = updatedData;
  } else {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(updatedData);
  }

  const res = await fetch(`${API_URL}/posts/${id}/`,options);
  return await res.json();
}

export async function deletePost(token, id) {
  const res = await fetch(`${API_URL}/posts/${id}/`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  // if(!res.ok) throw new Error("Failed to delete Post.");
  if (!res.ok) toast.error("Failed to delete the post");
  else toast.success("Post deleted Successfully");
  if (res.status !== 204) return res.json();
  return null;
}

export async function fetchMyPosts(token) {
  try {
    const res = await API.get("/posts/my_posts/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch your posts.");
    return [];
  }
}

export async function fetchDashboard(token) {
  try {
    const res = await API.get("/dashboard/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    toast.error("Failed to fetch the Dashboard.");
    return [];
  }
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories/`);
  // if(!res.ok) throw new Error("Failed to fetch Categories");
  if (!res.ok) toast.error("Failed to fetch the categories");
  return res.json();
}
