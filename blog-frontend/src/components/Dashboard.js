import React, { useState } from "react";
import { UseAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import PostList from "./PostList";

export default function Dashboard({
  stats,
  topCategories,
  recentPosts,
  myPosts,
  editingPostId,
  editForm,
  onEditChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onDelete,
  onPostUpdate,
}) {
  const { state, dispatch } = UseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    dispatch({ type: "LOGOUT" });
    toast.info("You have been logged out.");
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      {/* Sidebar */}
      <aside
        className={`bg-dark text-white p-3 flex-shrink-0 ${
          sidebarOpen ? "d-block position-fixed vh-100" : "d-none d-md-block"
        }`}
        style={{ width: "250px", zIndex: 1000 }}
      >
        <h4 className="fw-bold mb-4">📊 Dashboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a href="#overview" className="nav-link text-white">
              <i className="bi bi-speedometer2 me-2"></i> Overview
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#categories" className="nav-link text-white">
              <i className="bi bi-tags me-2"></i> Categories
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#recent" className="nav-link text-white">
              <i className="bi bi-journal-text me-2"></i> Recent Posts
            </a>
          </li>
          <li className="nav-item mb-2">
            <a href="#all-posts" className="nav-link text-white">
              <i className="bi bi-collection me-2"></i> All Posts
            </a>
          </li>
          <li className="nav-item mt-4">
            <button
              className="btn btn-outline-light w-100"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Hamburger toggle for mobile */}
      <div className="d-md-none bg-dark text-white p-2 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">📊 Dashboard</h5>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow-1 p-3 p-md-4 bg-light">
        {/* Stats */}
        <section id="overview" className="mb-4">
          <div className="row g-3">
            <StatCard label="Posts" value={stats?.total_posts ?? 0} color="primary" />
            <StatCard label="Likes" value={stats?.total_likes ?? 0} color="success" />
            <StatCard label="Views" value={stats?.total_views ?? 0} color="info" />
            <StatCard label="Comments" value={stats?.total_comments ?? 0} color="warning" />
          </div>
        </section>

        {/* Top Categories */}
        <section id="categories" className="mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">🏆 Top Categories</div>
            <ul className="list-group list-group-flush">
              {topCategories.length === 0 ? (
                <li className="list-group-item text-muted">No categories yet</li>
              ) : (
                topCategories.map((c) => (
                  <li
                    key={c.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {c.name}
                    <span className="badge bg-primary rounded-pill">{c.post_count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Recent Posts */}
        <section id="recent" className="mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">📝 Recent Posts</div>
            <div className="card-body">
              {recentPosts.length === 0 ? (
                <p className="text-muted">No recent posts</p>
              ) : (
                <PostList
                  posts={recentPosts}
                  editingPostId={editingPostId}
                  editForm={editForm}
                  onEditChange={onEditChange}
                  onStartEditing={onStartEditing}
                  onCancelEditing={onCancelEditing}
                  onSaveEdit={onSaveEdit}
                  onDelete={onDelete}
                  currentUser={state.user?.username}
                  onPostUpdate={onPostUpdate}
                />
              )}
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section id="all-posts">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">📚 All My Posts</div>
            <div className="card-body">
              {myPosts.length === 0 ? (
                <p className="text-muted">You haven't created any post yet.</p>
              ) : (
                <>
                  <h2 className="mb-4 text-center text-primary fw-bold">
                    <i className="bi bi-journal-text me-2"></i> Latest Posts
                  </h2>
                  <PostList
                    posts={myPosts}
                    editingPostId={editingPostId}
                    editForm={editForm}
                    onEditChange={onEditChange}
                    onStartEditing={onStartEditing}
                    onCancelEditing={onCancelEditing}
                    onSaveEdit={onSaveEdit}
                    onDelete={onDelete}
                    currentUser={state.user?.username}
                    onPostUpdate={onPostUpdate}
                  />
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Stat Card Component ---
function StatCard({ label, value, color }) {
  return (
    <div className="col-6 col-md-3">
      <div className={`card text-center border-${color} shadow-sm`}>
        <div className={`card-body text-${color}`}>
          <h6 className="card-title text-muted">{label}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
