import { useState } from "react";

function AnalyzeVideo({ onBack }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      alert("Please select a valid video file.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  }

  function handleDrop(e) {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (!droppedFile || !droppedFile.type.startsWith("video/")) {
      alert("Please drop a valid video file.");
      return;
    }

    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
    setResult(null);
  }

  function analyzeVideo() {
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    // Temporary frontend demo.
    // Later this will call your FastAPI backend.
    setTimeout(() => {
      setAnalyzing(false);

      setResult({
        classification: "Potential Deepfake / Synthetic",
        confidence: 96,
        flaggedFrames: "14 of 450",
        fingerprint: "vid_hash_8829f0a",
        matches: 2,
      });
    }, 2200); // Slightly longer for video analysis feel
  }

  function removeVideo() {
    setFile(null);
    setPreview("");
    setResult(null);
  }

  return (
    <div className="analyze-page">

      {/* Header */}
      <header className="analyze-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div>
          <p className="welcome-small">AI ANALYSIS</p>
          <h1>Analyze Video</h1>
        </div>
      </header>

      <div className="analyze-layout">

        {/* Main Upload Area */}
        <section className="upload-card">
          <p className="section-label">VIDEO ANALYSIS</p>
          <h2>Submit an authorized video</h2>
          <p className="analyze-description">
            The video frames will be analyzed for facial manipulation, synthetic artifacts, and unauthorized deepfake distribution locally.
          </p>

          {!file ? (
            <div
              className="drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="upload-icon">↑</div>
              <h3>Drop your video here</h3>
              <p>or select a video file from your device</p>

              <label className="upload-button">
                Choose Video
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={handleFile}
                  hidden
                />
              </label>
              <small>Supported: MP4, MOV, WEBM</small>
            </div>
          ) : (
            <div className="image-preview-area">
              <div className="preview-header">
                <div>
                  <strong>{file.name}</strong>
                  <p>{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button className="remove-button" onClick={removeVideo}>
                  Remove
                </button>
              </div>

              {/* VIDEO PREVIEW CONTAINER WITH SCAN ANIMATION */}
              <div className="preview-container">
                <video
                  src={preview}
                  className="preview-image"
                  controls
                  muted
                  style={{ maxHeight: "300px", width: "100%" }}
                />

                {/* THE ACTIVE AI SCAN OVERLAY */}
                {analyzing && (
                  <div className="scan-overlay">
                    <div className="scan-line"></div>
                    <div className="bounding-box"></div>
                  </div>
                )}
              </div>

              {!result && !analyzing && (
                <button className="analyze-button" onClick={analyzeVideo}>
                  🔍 Analyze Video Frames
                </button>
              )}

              {/* HIGH-TECH LOADING TEXT */}
              {analyzing && (
                <div className="loading-state" style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>
                  <strong style={{ color: "#10b981", fontSize: "16px", display: "block", marginBottom: "8px", letterSpacing: "1px" }}>
                    [ EXTRACTING & SCANNING FRAMES ]
                  </strong>
                  <p style={{ color: "#737d8e", fontSize: "13px" }}>
                    Running temporal analysis and localized deepfake detection via Wasm...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Privacy */}
          <div className="analysis-privacy" style={{ marginTop: file ? "20px" : "0" }}>
            <span>🔒</span>
            <div>
              <strong>Privacy & Safety</strong>
              <p>
                Only upload media you are authorized to process. Raw video files remain inside your client session memory.
              </p>
            </div>
          </div>
        </section>

        {/* Right Information Panel */}
        <aside className="analysis-info">
          <div className="info-icon">🛡️</div>
          <h3>What SentinEx Video AI checks</h3>

          <div className="analysis-step">
            <span>01</span>
            <div>
              <strong>Frame Extraction</strong>
              <p>Extracts key frames across temporal intervals to look for anomalies.</p>
            </div>
          </div>

          <div className="analysis-step">
            <span>02</span>
            <div>
              <strong>Facial Artifact Detection</strong>
              <p>Evaluates facial boundary blending and warping typical of deepfakes.</p>
            </div>
          </div>

          <div className="analysis-step">
            <span>03</span>
            <div>
              <strong>Video Hashing</strong>
              <p>Computes sequential perceptual hashes for cross-platform identification.</p>
            </div>
          </div>

          <div className="analysis-step">
            <span>04</span>
            <div>
              <strong>Evidence Locker</strong>
              <p>Flags specific timestamps and frames for legal reporting.</p>
            </div>
          </div>
        </aside>

      </div>

      {/* Result */}
      {result && (
        <section className="analysis-result">
          <div className="result-header">
            <div>
              <p className="section-label">ANALYSIS COMPLETE</p>
              <h2>Video Analysis Result</h2>
            </div>
            <span className="result-status">✓ Completed</span>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <span>Classification</span>
              <strong className="warning-result">{result.classification}</strong>
            </div>

            <div className="result-card">
              <span>Model Confidence</span>
              <strong>{result.confidence}%</strong>
            </div>

            <div className="result-card">
              <span>Flagged Frames</span>
              <strong className="warning-result">{result.flaggedFrames}</strong>
            </div>

            <div className="result-card">
              <span>Potential Matches</span>
              <strong>{result.matches}</strong>
            </div>
          </div>

          <div className="result-warning">
            <span>⚠️</span>
            <div>
              <strong>AI detection is an indicator, not proof.</strong>
              <p>Results should be reviewed by an authorized person before reporting or taking further action.</p>
            </div>
          </div>

          <button className="continue-button">
            Review Flagged Video Evidence →
          </button>
        </section>
      )}

    </div>
  );
}

export default AnalyzeVideo;