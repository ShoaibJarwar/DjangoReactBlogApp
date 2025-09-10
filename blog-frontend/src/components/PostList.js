import React from "react";
import PostItem from "./PostItem";

export default function PostList({
  posts,
  editingPostId,
  editForm,
  onEditChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onDelete,
  currentUser,
  onPostUpdate,
}) {
  if (!posts || posts.length === 0) {
    return (
      <div className="alert alert-info text-center mt-3">
        <i className="bi bi-info-circle me-2"></i>
        No posts available. Be the first to create one!
      </div>
    );
  }

  return (
    <div className="container my-4">

      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.id} className="col-12 col-md-10 mx-auto">
            <PostItem
              post={post}
              isEditing={editingPostId === post.id}
              editForm={editForm}
              onEditChange={onEditChange}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              onSaveEdit={onSaveEdit}
              onDelete={onDelete}
              currentUser={currentUser}
              onPostUpdate={onPostUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
