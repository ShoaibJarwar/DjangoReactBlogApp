import React from "react";

export default function PostEditor({ editForm, onEditChange, onSave, onCancel }) {
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
            value={editForm.title}
            onChange={onEditChange}
            placeholder="Edit title"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            value={editForm.content}
            onChange={onEditChange}
            placeholder="Edit content..."
            rows={5}
            required
          />
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={onSave}
          >
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
