import React, { useState } from "react";

function AITextGenerator({ token, onInsert }) {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const generateText = async () => {
    setLoading(true);
    setGenerated("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ai/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.generated_text) {
        setGenerated(data.generated_text);
      } else {
        setGenerated("⚠️ Failed to generate text");
      }
    } catch (err) {
      setGenerated("⚠️ Error: " + err.message);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
  };

  return (
    <div
      className="modal fade"
      id="aiGeneratorModal"
      tabIndex="-1"
      aria-labelledby="aiGeneratorModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="aiGeneratorModalLabel">
              ✨ AI Post Generator
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control mb-3"
              placeholder="Enter topic or prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="3"
            />
            <button
              className="btn btn-primary mb-3"
              onClick={generateText}
              disabled={loading || !prompt}
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            {generated && (
              <div className="border p-3 rounded bg-light">
                <h6>Generated Draft:</h6>
                <pre style={{ whiteSpace: "pre-wrap" }}>{generated}</pre>

                <div className="d-flex gap-2 mt-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={copyToClipboard}
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => onInsert(generated)}
                    data-bs-dismiss="modal"
                  >
                    Insert into Editor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITextGenerator;
