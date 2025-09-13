import React, { useState, useEffect } from "react";
import PostEditor from "./PostEditor";
import axios from "axios";
import { toast } from "react-toastify";

const PostItemComponent = ({
  post,
  isEditing,
  editForm,
  // setEditForm,
  onEditChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  handleFileChange,
  onDelete,
  currentUser,
  onPostUpdate,
}) => {
  // const [alreadyLiked, setAlreadyLiked] = useState(post.liked_by ?? false);
  const [liked, setLiked] = useState(post.liked_by ?? false);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [addingComment, setAddingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  // --- Utils ---
  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleString();
  };

  // --- Like Handler ---
  const handleLikeToggle = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await axios.post(
        `https://djangoreactblogapp-production.up.railway.app/api/posts/${post.id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);

      if (onPostUpdate) {
        onPostUpdate(post.id, {
          liked_by: res.data.liked,
          likes_count: res.data.likes_count,
        });
      }
    } catch (err) {
      toast.error("Error liking post");
    } finally {
      setLiking(false);
    }
  };

  // --- Toggle Comments ---
  const handleToggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      try {
        const res = await axios.get(
          `https://djangoreactblogapp-production.up.railway.app/api/comments/?post=${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setComments(res.data);
      } catch (err) {
        toast.error("Error loading comments.");
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  // --- Add Comment ---
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setAddingComment(true);
    try {
      const res = await axios.post(
        "https://djangoreactblogapp-production.up.railway.app/api/comments/",
        { post: post.id, text: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setComments([res.data, ...comments]);
      if (onPostUpdate) {
        onPostUpdate(post.id, {
          comment_count: (post.comment_count || 0) + 1,
        });
      }
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Error adding comment.");
    } finally {
      setAddingComment(false);
    }
  };

  useEffect(() => {
    setLiked(post.liked_by ?? false);
    setLikesCount(post.likes_count ?? 0);
  }, [post.liked_by, post.likes_count]);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        {isEditing ? (
          <PostEditor
            post={post}
            editForm={editForm}
            // setEditForm={setEditForm}
            onEditChange={onEditChange}
            onSave={() => onSaveEdit(post.id)}
            handleFileChange={handleFileChange}
            onCancel={onCancelEditing}
          />
        ) : (
          <>
            {/* Title + Meta */}
            <h4 className="card-title">{post.title}</h4>
            <div className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
              By <strong>{post.author}</strong> • {timeAgo(post.on_created)}
            </div>

            {post.images && post.images.length > 0 && (
              <div
                id={`postCarousel-${post.id}`}
                className="carousel slide mb-3"
                data-bs-ride="carousel"
              >
                {/* Indicators (dots) */}
                <div className="carousel-indicators">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      data-bs-target={`#postCarousel-${post.id}`}
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0 ? "true" : "false"}
                      aria-label={`Slide ${index + 1}`}
                    ></button>
                  ))}
                </div>

                {/* Carousel items */}
                <div
                  className="carousel-inner rounded shadow-sm"
                  style={{
                    height: "350px", // fixed height
                  }}
                >
                  {post.images.map((img, index) => (
                    <div
                      key={img.id}
                      className={`carousel-item text-center ${
                        index === 0 ? "active" : ""
                      }`}
                      style={{
                        position: "relative",
                        height: "300px", // fixed container height
                        width: "100%",
                        // background: "#f5f5f5", 
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={`${img.image}`}
                        alt={`${post.title} - ${index + 1}`}
                        className="d-block w-100 h-100"
                        style={{
                          position: "absolute", 
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Controls */}
                {post.images.length > 1 && (
                  <>
                    <div style={{position: "absolute", top: "40%", left: "0%"}}>
                      <button
                      className="carousel-control-prev bg-dark border border-light rounded-circle d-flex justify-content-center align-items-center p-2"
                      style={{ width: "30px", height: "30px" }}
                      type="button"
                      data-bs-target={`#postCarousel-${post.id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    </div>

                    <div style={{position: "absolute", top: "40%", right: "0%"}}>
                      <button
                      className="carousel-control-next bg-dark border border-light rounded-circle d-flex justify-content-center align-items-center p-2"
                      style={{ width: "30px", height: "30px" }}
                      type="button"
                      data-bs-target={`#postCarousel-${post.id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content Preview */}
            <p className="card-text">
              {post.content.length > 120
                ? post.content.substring(0, 120) + "..."
                : post.content}
            </p>

            {/* Meta Info */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="badge bg-info text-dark">
                📂 {post.category_name}
              </span>
              <small className="text-muted">
                💬 {post.comment_count} comments
              </small>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 flex-wrap">
              <button
                onClick={handleLikeToggle}
                disabled={liking}
                className="btn btn-sm btn-outline-primary like-btn"
              >
                <span className={`like-text ${liked ? "liked" : ""}`}>
                  {liked ? (
                    <i className="fas fa-thumbs-up"></i>
                  ) : (
                    <i className="far fa-thumbs-up"></i>
                  )}{" "}
                  ({likesCount})
                </span>
              </button>

              <button
                onClick={handleToggleComments}
                className="btn btn-sm btn-primary"
              >
                {showComments ? "Hide 💬" : "💬 Comment"}
              </button>

              {currentUser === post.author && (
                <>
                  <button
                    onClick={() => onStartEditing(post)}
                    className="btn btn-sm btn-warning"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-3">
                {/* Add Comment */}
                <form 
                  onSubmit={handleAddComment}
                  className="d-flex gap-2 align-items-center"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="form-control form-control-sm"
                  />
                  <button
                    type="submit"
                    disabled={addingComment}
                    className="btn btn-sm btn-primary"
                  >
                    {addingComment ? "Adding..." : "Add"}
                  </button>
                </form>

                {/* Comment List */}
                <div className="mt-3">
                  {loadingComments ? (
                    <p>Loading comments...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-muted">No comments yet.</p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="border-top pt-2 mt-2"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <strong>{c.author}</strong>: {c.text}
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {timeAgo(c.created_at)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const PostItem = React.memo(PostItemComponent);
export default PostItem;
