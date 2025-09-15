import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Custom Upload Adapter
// class CustomUploadAdapter {
//   constructor(loader, token) {
//     this.loader = loader;
//     this.token = token;
//   }

//   upload() {
//     return this.loader.file.then(
//       (file) =>
//         new Promise((resolve, reject) => {
//           const data = new FormData();
//           data.append("upload", file);

//           fetch("http://127.0.0.1:8000/api/upload/", {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${this.token}`,
//             },
//             body: data,
//           })
//             .then((res) => res.json())
//             .then((result) => resolve({ default: result.url }))
//             .catch((err) => reject(err));
//         })
//     );
//   }

//   abort() {}
// }

// function CustomUploadPlugin(editor, token) {
//   editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
//     new CustomUploadAdapter(loader, token);
// }

export default function PostEditor({
  editForm,
  onEditChange,
  onSave,
  handleFileChange,
  onCancel,
}) {
  const [content, setContent] = useState("");

  // Initialize CKEditor content from editForm.content
  useEffect(() => {
    if (editForm?.content) {
      setContent(editForm.content);
    }
  }, [editForm?.content]);

  if (!editForm) return null;

  return (
    <div className="card shadow-sm border-0 rounded-3 my-3">
      <div className="card-body">
        <h5 className="card-title text-primary mb-3">
          <i className="bi bi-pencil-square me-2"></i> Edit Post
        </h5>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Post Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={editForm.title || ""}
            onChange={onEditChange}
            placeholder="Edit title"
            required
          />
        </div>

        {/* Content with CKEditor */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <CKEditor
            key={editForm.id || "editor"}
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
              onEditChange({ target: { name: "content", value: data } });
            }}
            config={{
              // extraPlugins: [(editor) => CustomUploadPlugin(editor, token)],
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "insertTable",
                "undo",
                "redo",
              ],
            }}
          />
        </div>

        {/* Existing Images */}
        {editForm.existingImages && editForm.existingImages.length > 0 && (
          <div className="mt-2 d-flex flex-wrap gap-2">
            {editForm.existingImages.map((img) => (
              <div
                key={img.id}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={img.image}
                  alt="existing"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    onEditChange({
                      target: { name: "imagesToDelete", value: img.id },
                    })
                  }
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    fontSize: "12px",
                    lineHeight: "18px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New Images */}
        <div className="mb-3">
          <label className="form-label">Images</label>
          <input
            type="file"
            className="form-control"
            name="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {editForm.images && editForm.images.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {Array.from(editForm.images).map((file, idx) => (
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

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-success" onClick={onSave}>
            <i className="bi bi-check-circle me-1"></i> Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            <i className="bi bi-x-circle me-1"></i> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}