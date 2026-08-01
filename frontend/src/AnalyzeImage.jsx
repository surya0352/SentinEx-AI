import { useState } from "react";

function AnalyzeImage({ onBack }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  function handleFile(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  }

  function handleDrop(e) {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];

    if (!droppedFile || !droppedFile.type.startsWith("image/")) {
      return;
    }

    setFile(droppedFile);
    setPreview(URL.createObjectURL(droppedFile));
    setResult(null);
  }

  function analyzeImage() {
    if (!file) return;

    setAnalyzing(true);
    setResult(null);

    // Temporary mock AI processing.
    // Later this will call the FastAPI backend.
    setTimeout(() => {
      setAnalyzing(false);

      setResult({
        classification: "Potentially Sensitive",
        confidence: 94,
        fingerprint: "Generated",
        matches: 3,
      });
    }, 1800);
  }

  function removeImage() {
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
          <h1>Analyze Image</h1>
        </div>

      </header>


      <div className="analyze-layout">

        {/* Main Upload Area */}
        <section className="upload-card">

          <p className="section-label">
            IMAGE ANALYSIS
          </p>

          <h2>Submit an authorized image</h2>

          <p className="analyze-description">
            The image will be analyzed for potentially sensitive
            content and a perceptual fingerprint can be generated
            for authorized similarity matching.
          </p>


          {!file ? (

            <div
              className="drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >

              <div className="upload-icon">
                ↑
              </div>

              <h3>Drop your image here</h3>

              <p>
                or select an image from your device
              </p>

              <label className="upload-button">
                Choose Image

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  hidden
                />
              </label>

              <small>
                Supported: JPG, PNG, WEBP
              </small>

            </div>

          ) : (

            <div className="image-preview-area">

              <div className="preview-header">

                <div>
                  <strong>{file.name}</strong>

                  <p>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  className="remove-button"
                  onClick={removeImage}
                >
                  Remove
                </button>

              </div>

              <div className="preview-image-wrapper">
                <img
                  src={preview}
                  alt="Selected image preview"
                />
              </div>

              {!result && !analyzing && (
                <button
                  className="analyze-button"
                  onClick={analyzeImage}
                >
                  🔍 Analyze Image
                </button>
              )}

              {analyzing && (
                <div className="processing-box">

                  <div className="loader"></div>

                  <div>
                    <strong>Analyzing image...</strong>

                    <p>
                      Running content detection and preparing
                      fingerprint.
                    </p>
                  </div>

                </div>
              )}

            </div>

          )}


          {/* Privacy */}
          <div className="analysis-privacy">

            <span>🔒</span>

            <div>
              <strong>Privacy & Safety</strong>

              <p>
                Only upload an image you are authorized to
                process. Avoid unnecessary copies of sensitive
                material and never share case information
                publicly.
              </p>
            </div>

          </div>

        </section>


        {/* Right Information Panel */}
        <aside className="analysis-info">

          <div className="info-icon">
            🛡️
          </div>

          <h3>What SentinEx AI checks</h3>

          <div className="analysis-step">

            <span>01</span>

            <div>
              <strong>Content Detection</strong>

              <p>
                A specialized vision model evaluates whether
                the image may contain sensitive content.
              </p>
            </div>

          </div>

          <div className="analysis-step">

            <span>02</span>

            <div>
              <strong>Fingerprint</strong>

              <p>
                A perceptual fingerprint can represent the
                visual characteristics of the submitted image.
              </p>
            </div>

          </div>

          <div className="analysis-step">

            <span>03</span>

            <div>
              <strong>Similarity Matching</strong>

              <p>
                The fingerprint can be compared against an
                authorized reference dataset.
              </p>
            </div>

          </div>

          <div className="analysis-step">

            <span>04</span>

            <div>
              <strong>Evidence</strong>

              <p>
                Relevant results can be organized within
                the associated case.
              </p>
            </div>

          </div>

        </aside>

      </div>


      {/* Result */}
      {result && (

        <section className="analysis-result">

          <div className="result-header">

            <div>
              <p className="section-label">
                ANALYSIS COMPLETE
              </p>

              <h2>Analysis Result</h2>
            </div>

            <span className="result-status">
              ✓ Completed
            </span>

          </div>


          <div className="result-grid">

            <div className="result-card">

              <span>Content Classification</span>

              <strong className="warning-result">
                {result.classification}
              </strong>

            </div>


            <div className="result-card">

              <span>Model Confidence</span>

              <strong>
                {result.confidence}%
              </strong>

            </div>


            <div className="result-card">

              <span>Fingerprint</span>

              <strong className="success-result">
                ✓ {result.fingerprint}
              </strong>

            </div>


            <div className="result-card">

              <span>Potential Matches</span>

              <strong>
                {result.matches}
              </strong>

            </div>

          </div>


          <div className="result-warning">

            <span>⚠️</span>

            <div>

              <strong>
                Detection is not proof of non-consensual sharing.
              </strong>

              <p>
                AI results are indicators that require human
                review and additional evidence before reporting
                or taking further action.
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

export default AnalyzeImage;