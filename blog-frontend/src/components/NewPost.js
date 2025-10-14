import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getCategories } from "../api";
import { UseAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AIGenerator from "./AIGenerator";

export default function NewPost({ onPostCreated }) {
  const { state } = UseAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    getCategories().then((data) => setCategory(data));
  }, []);

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const insertAIText = (text) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.model.change((writer) => {
        const insertPosition =
          editor.model.document.selection.getFirstPosition();

        // ✅ Plain text insert
        writer.insertText(text, insertPosition);

        // ✅ Styled block insert (same as PostEditor)
        const viewFragment = editor.data.processor.toView(`
          <div class="ai-text" style="background:#f5f7ff; padding:12px; border-left:4px solid #3f51b5; border-radius:6px; margin:8px 0;">
            <p>${text}</p>
          </div>
        `);

        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment, insertPosition);
      });

      const updatedData = editor.getData();
      setContent(updatedData);
    } else {
      setContent((prev) => prev + "\n" + text);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", Number(selectedCategory));
      formData.append("published", true);

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(
        "http://127.0.0.1:8000/api/posts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onPostCreated(res.data);
      toast.success("Post created successfully!");

      // reset form
      setTitle("");
      setContent("");
      setSelectedCategory("");
      setImages([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
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
    <div className="card shadow-sm border-0 rounded-3 my-4">
      <div className="card-body p-4">
        <h3 className="card-title mb-4 text-primary">
          <i className="bi bi-plus-circle me-2"></i> Create New Post
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Inline AI Generator */}
          <AIGenerator token={state.token} onInsert={insertAIText} />

          {/* CKEditor */}
          <div className="mb-3">
            <label className="form-label">Content</label>
            <CKEditor
              editor={ClassicEditor}
              data={content}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "insertTable",
                  "undo",
                  "redo",
                ],
              }}
              onReady={(editor) => {
                editorRef.current = editor;
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>

          {/* Category */}
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

          {/* Images */}
          <div className="mb-3">
            <label className="form-label">Images</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
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
  );
}
