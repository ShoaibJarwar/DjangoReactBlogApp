import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AITextGenerator from "./AITextGenerator";
import { UseAuth } from "../context/AuthContext";


export default function PostEditor({
  editForm,
  onEditChange,
  onSave,
  handleFileChange,
  onCancel, 
}) {
  const [content, setContent] = useState("");
  const { state } = UseAuth();
  const editorRef = useRef(null);

  // const insertGeneratedText = (text) => {
  //   const newContent = content + "<p>" + text + "</p>";
  //   setContent(newContent);
  //   onEditChange({ target: { name: "content", value: newContent } });
  // };

  const insertAIText = (text) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.model.change((writer) => {
        const insertPosition = editor.model.document.selection.getFirstPosition();
        writer.insertText(text, insertPosition);

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
      onEditChange({ target: { name: "content", value: updatedData } });
    } else {
      setContent((prev) => prev + "\n" + text);
    }
  };


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
        <div>
          <button
            className="btn btn-outline-secondary mb-3"
            data-bs-toggle="modal"
            data-bs-target="#aiGeneratorModal"
          >
            ✨ AI Post Generator
          </button>
          <AITextGenerator token={state.token} onInsert={insertAIText} />
        </div>

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
            onReady={(editor) => {
              editorRef.current = editor;
            }}
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
          <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={onSave}>
            <i className="bi bi-check-circle me-1"></i> Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            onClick={onCancel}
          >
            <i className="bi bi-x-circle me-1"></i> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}