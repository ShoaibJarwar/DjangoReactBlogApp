import React, { useEffect, useState, useRef } from "react";
import {
  fetchPosts,
  fetchDashboard,
  fetchMyPosts,
  getCategories,
  updatePost,
  deletePost,
} from "../api";
import NewPost from "./NewPost";
import CategoryFilter from "./CategoryFilter";
import PostList from "./PostList";
import { UseAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import PostEditor from "./PostEditor";

export default function Posts() {
  const { state, dispatch } = UseAuth();
  const fileInputRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  async function loadPosts(categoryId = null) {
    try {
      const token = localStorage.getItem("access");
      const data = await fetchPosts(token, categoryId);
      setPosts(data); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard() {
    try {
      const res = await fetchDashboard(localStorage.getItem("access"));
      setStats(res.stats);
      setTopCategories(res.top_categories);
      setRecentPosts(res.recent_posts);
    } catch (err) {
      toast.error("Error loading dashboard");
    }
  }

  const loadMyPosts = async () => {
    try {
      const res = await fetchMyPosts(localStorage.getItem("access"));
      setMyPosts(res);
    } catch (err) {
      toast.error("Failed to fetch the posts.");
    } finally {
      setLoading(false);
    }
  };

  async function loadCategories() {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    loadPosts();
    loadDashboard();
    loadMyPosts();
    loadCategories();
    setLoading(false);
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    loadPosts(categoryId || null);
    loadDashboard();
    loadMyPosts();
  };

  const handlePostCreated = () => {
    loadPosts(selectedCategory);
    loadDashboard();
    loadMyPosts();
    loadCategories();
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditForm({
      title: post.title,
      content: post.content && post.content !== "undefined" ? post.content : "",
      images: [],
      existingImages: post.images || [],
    });
    const editModal = new window.bootstrap.Modal(
      document.getElementById("editPostModal")
    );
    editModal.show();
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditForm({ title: "", content: "", images: [] });
  };

  const handleFileChange = (e) => {
    // setImages([...e.target.files]);
    const files = Array.from(e.target.files);
    // console.log("Selected files from file input (should show here):", files);

    setEditForm((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "imagesToDelete") {
      setEditForm((prev) => ({
        ...prev,
        imagesToDelete: [...(prev.imagesToDelete || []), value],
        existingImages: prev.existingImages.filter((img) => img.id !== value),
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
  };

  const saveEdit = async (id) => {
    const formData = new FormData();
    try {
      formData.append("title", editForm.title || "");
      formData.append("content", editForm.content || "");

      if (editForm.imagesToDelete && editForm.imagesToDelete.length > 0) {
        editForm.imagesToDelete.forEach((id) => {
          formData.append("imagesToDelete", id);
        });
      }

      if (editForm.images && editForm.images.length > 0) {
        Array.from(editForm.images).forEach((file) => {
          formData.append("images", file);
        });
      }

      for (let [key, val] of formData.entries()) {
        console.log("FormData ->", key, val instanceof File ? val.name : val);
      }

      await updatePost(state.token, id, formData, true);
      // console.log(formData);
      cancelEditing();
      loadPosts(selectedCategory);
      loadDashboard();
      loadMyPosts();
      toast.success("Post updated successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const removePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete the post?")) return;
    try {
      await deletePost(state.token, id);
      loadPosts(selectedCategory);
      loadDashboard();
      loadMyPosts();
      loadCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePostLikeUpdate = (postId, updatedData) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updatedData } : p))
    );
    setMyPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updatedData } : p))
    );
    setRecentPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updatedData } : p))
    );
    loadDashboard();
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    dispatch({ type: "LOGOUT" });
    toast.info("You have been logged out.");
  };

  if (loading) return <p>Loading Posts...</p>;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <span
            className="navbar-brand fw-bold"
            style={{ color: "#f8d210", fontSize: "1.3rem" }}
          >
            🚀 Blog Post App
          </span>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <div className="ms-auto d-flex flex-column flex-lg-row gap-2">
              {state.user ? (
                <>
                  <button
                    className="btn btn-outline-light btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#dashboardModal"
                  >
                    📊 Dashboard
                  </button>
                  <button
                    className="btn btn-outline-light btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#profileModal"
                  >
                    👤 Profile
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-sm btn-outline-light" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-sm btn-primary" to="/register">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Info Banner */}
      <div
        className="text-center text-white py-2 px-3"
        style={{
          background: "linear-gradient(90deg, #007bff, #6610f2)",
          fontSize: "0.95rem",
        }}
      >
        Welcome, <strong>{state.user?.username || "Guest"}</strong>! 🚀 Manage
        your posts, explore categories, and customize your profile.
      </div>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-12 col-md-4 col-lg-3 mb-3">
            <div className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">📂 Filters</h5>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">⚡ Quick Actions</h5>
                <button
                  type="button"
                  className="btn btn-primary w-100 mb-2"
                  data-bs-toggle="modal"
                  data-bs-target="#newPostModal"
                >
                  ➕ New Post
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-12 col-md-8 col-lg-9">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="mb-3">📝 All Blog Posts</h3>
                <PostList
                  posts={posts}
                  editingPostId={editingPostId}
                  editForm={editForm}
                  // setEditForm={setEditForm}
                  onEditChange={handleEditChange}
                  onStartEditing={startEditing}
                  onCancelEditing={cancelEditing}
                  onSaveEdit={saveEdit}
                  handleFileChange={handleFileChange}
                  onDelete={removePost}
                  currentUser={state.user?.username}
                  onPostUpdate={handlePostLikeUpdate}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals (unchanged except styling is already responsive in Bootstrap) */}
      {/* New Post Modal */}
      <div
        className="modal fade"
        id="newPostModal"
        tabIndex="-1"
        aria-labelledby="newPostModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="newPostModalLabel">
                ➕ Create a New Post
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <NewPost onPostCreated={handlePostCreated} />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Modal */}
      <div
        className="modal fade"
        id="dashboardModal"
        tabIndex="-1"
        aria-labelledby="dashboardModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content shadow">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title" id="dashboardModalLabel">
                📊 Dashboard
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Dashboard
                stats={stats}
                topCategories={topCategories}
                recentPosts={recentPosts}
                myPosts={myPosts}
                editingPostId={editingPostId}
                editForm={editForm}
                onEditChange={handleEditChange}
                onStartEditing={startEditing}
                onCancelEditing={cancelEditing}
                onSaveEdit={saveEdit}
                handleFileChange={handleFileChange}
                onDelete={removePost}
                onPostUpdate={handlePostLikeUpdate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <div
        className="modal fade"
        id="profileModal"
        tabIndex="-1"
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content shadow">
            <div className="modal-header bg-secondary text-white">
              <h5 className="modal-title" id="profileModalLabel">
                👤 Profile
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Profile />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <div
        className="modal fade"
        id="editPostModal"
        tabIndex="-1"
        aria-labelledby="editPostModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content shadow">
            <div className="modal-header bg-warning">
              <h5 className="modal-title" id="editPostModalLabel">
                ✏️ Edit Post
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={cancelEditing}
              ></button>
            </div>
            <div className="modal-body">
              <PostEditor
                editForm={editForm}
                onEditChange={handleEditChange}
                handleFileChange={handleFileChange}
                onSave={() => saveEdit(editingPostId)}
                onCancel={cancelEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
