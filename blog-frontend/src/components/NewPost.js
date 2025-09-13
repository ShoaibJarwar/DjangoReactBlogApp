import React, { useEffect, useState, useRef } from "react";
import { createPost, getCategories } from "../api";
import { UseAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function NewPost({ onPostCreated }) {
  const { state } = UseAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null)

  useEffect(() => {
    getCategories().then((data) => setCategory(data));
  }, []);

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // FormData for sending files + text
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", Number(selectedCategory));
      formData.append("published", true);

      images.forEach((file) => {
        formData.append("images", file); 
      });

      const newPost = await createPost(state.token, formData);
      // Pass true if your createPost function handles multipart/form-data

      onPostCreated(newPost);

      const updatedCategories = await getCategories();
      setCategory(updatedCategories);

      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setSelectedCategory("");
      setImages([]);

      if(fileInputRef.current){
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating post");
    }
  }

  if (!state.user)
    return (
      <div className="alert alert-warning text-center mt-3">
        You must be logged in to create a post.
      </div>
    );

  return (
    <div className="container my-4">
      <div className="card shadow border-0 rounded-3">
        <div className="card-body p-4">
          <h3 className="card-title mb-4 text-primary">
            <i className="bi bi-plus-circle me-2"></i> Create New Post
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {Array.isArray(category) &&
                  category.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.post_count})
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Images</label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {images.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {Array.from(images).map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100 btn-lg">
              <i className="bi bi-send me-2"></i> Publish Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}