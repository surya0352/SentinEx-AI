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
        classification: "Potentially Sensitive",
        confidence: 92,
        frames: 48,
        flaggedFrames: 7,
        fingerprint: "Generated",
        matches: 2,
      });
    }, 2200);
  }

  function removeVideo() {
    setFile(null);
    setPreview("");
    setResult(null);
  }

  return (
    <div className="analyze-page">

      {/* HEADER */}
      <header className="analyze-header">

        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div>
          <p className="welcome-small">VIDEO ANALYSIS</p>
          <h1>Analyze Video</h1>
        </div>

      </header>


      <div className="analyze-layout">

        {/* MAIN CARD */}
        <section className="upload-card">

          <p className="section-label">
            VIDEO ANALYSIS
          </p>

          <h2>Submit an authorized video</h2>

          <p className="analyze-description">
            SentinEx AI can inspect video content by analyzing
            selected frames for potentially sensitive content
            and generating fingerprints for authorized matching.
          </p>


          {/* NO VIDEO */}
          {!file ? (

            <div
              className="drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >

              <div className="upload-icon">
                ▶
              </div>

              <h3>Drop your video here</h3>

              <p>
                or select a video from your device
              </p>

              <label className="upload-button">

                Choose Video

                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFile}
                  hidden
                />

              </label>

              <small>
                Supported: MP4, WEBM, MOV
              </small>

            </div>

          ) : (

            /* VIDEO SELECTED */
            <div className="image-preview-area">

              <div className="preview-header">

                <div>

                  <strong>
                    {file.name}
                  </strong>

                  <p>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>

                </div>

                <button
                  className="remove-button"
                  onClick={removeVideo}
                >
                  Remove
                </button>

              </div>


              <div className="video-preview-wrapper">

                <video
                  src={preview}
                  controls
                />

              </div>


              {!result && !analyzing && (

                <button
                  className="analyze-button"
                  onClick={analyzeVideo}
                >
                  🔍 Analyze Video
                </button>

              )}


              {analyzing && (

                <div className="processing-box">

                  <div className="loader"></div>

                  <div>

                    <strong>
                      Analyzing video...
                    </strong>

                    <p>
                      Inspecting frames and preparing
                      content analysis.
                    </p>

                  </div>

                </div>

              )}

            </div>

          )}


          {/* PRIVACY */}
          <div className="analysis-privacy">

            <span>🔒</span>

            <div>

              <strong>
                Privacy & Safety
              </strong>

              <p>
                Only upload a video you are authorized to
                process. Avoid unnecessary copies of sensitive
                material and protect case information.
              </p>

            </div>

          </div>

        </section>


        {/* RIGHT PANEL */}
        <aside className="analysis-info">

          <div className="info-icon">
            🎬
          </div>

          <h3>
            What SentinEx AI checks
          </h3>


          <div className="analysis-step">

            <span>01</span>

            <div>

              <strong>
                Frame Extraction
              </strong>

              <p>
                Relevant frames can be sampled from the
                submitted video.
              </p>

            </div>

          </div>


          <div className="analysis-step">

            <span>02</span>

            <div>

              <strong>
                Content Detection
              </strong>

              <p>
                A specialized vision model can evaluate
                selected frames for potentially sensitive content.
              </p>

            </div>

          </div>


          <div className="analysis-step">

            <span>03</span>

            <div>

              <strong>
                Fingerprinting
              </strong>

              <p>
                Relevant frames can be fingerprinted for
                authorized similarity matching.
              </p>

            </div>

          </div>


          <div className="analysis-step">

            <span>04</span>

            <div>

              <strong>
                Evidence
              </strong>

              <p>
                Results can be organized with the associated
                case for review and reporting.
              </p>

            </div>

          </div>

        </aside>

      </div>


      {/* RESULT */}
      {result && (

        <section className="analysis-result">

          <div className="result-header">

            <div>

              <p className="section-label">
                VIDEO ANALYSIS COMPLETE
              </p>

              <h2>
                Analysis Result
              </h2>

            </div>

            <span className="result-status">
              ✓ Completed
            </span>

          </div>


          <div className="result-grid">

            <div className="result-card">

              <span>
                Content Classification
              </span>

              <strong className="warning-result">
                {result.classification}
              </strong>

            </div>


            <div className="result-card">

              <span>
                Model Confidence
              </span>

              <strong>
                {result.confidence}%
              </strong>

            </div>


            <div className="result-card">

              <span>
                Frames Analyzed
              </span>

              <strong>
                {result.frames}
              </strong>

            </div>


            <div className="result-card">

              <span>
                Flagged Frames
              </span>

              <strong className="warning-result">
                {result.flaggedFrames}
              </strong>

            </div>

          </div>


          {/* SECOND ROW */}
          <div className="result-grid video-result-second-row">

            <div className="result-card">

              <span>
                Fingerprint
              </span>

              <strong className="success-result">
                ✓ {result.fingerprint}
              </strong>

            </div>


            <div className="result-card">

              <span>
                Potential Matches
              </span>

              <strong>
                {result.matches}
              </strong>

            </div>

          </div>


          <div className="result-warning">

            <span>⚠️</span>

            <div>

              <strong>
                AI detection is an indicator, not proof.
              </strong>

              <p>
                Results should be reviewed by an authorized
                person before reporting or taking further action.
              </p>

            </div>

          </div>


          <button className="continue-button">
            Review Potential Matches →
          </button>

        </section>

      )}

    </div>
  );
}

export default AnalyzeVideo;