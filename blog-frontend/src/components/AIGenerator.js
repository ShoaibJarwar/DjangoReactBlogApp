import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { marked } from "marked";

export default function AIGenerator({ token, onInsert }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);
      setGenerated("");
      const res = await axios.post(
        "http://127.0.0.1:8000/api/ai/generate/",
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res.data?.generated_text || res.data?.text || "";
      if (raw) {
        setGenerated(raw);
      } else {
        toast.error("No text generated");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Error generating text");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    if (generated) {
      // sirf ek dafa formatted HTML bhejna
      onInsert(marked(generated));
      toast.success("Inserted into editor!");
    }
  };

  return (
    <div className="mb-3 p-3 border rounded bg-light">
      <label className="form-label fw-bold">✨ AI Post Generator</label>
      <textarea
        className="form-control mb-2"
        rows="3"
        placeholder="Enter prompt for AI..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {generated && (
        <div className="mt-3 border p-3 rounded bg-white">
          <h6>Generated Preview:</h6>
          <div
            className="ai-generated-content"
            dangerouslySetInnerHTML={{ __html: marked(generated) }}
          />
          <button
            type="button"
            className="btn btn-success btn-sm mt-2"
            onClick={handleInsert}
          >
            Insert into Editor
          </button>
        </div>
      )}
    </div>
  );
}