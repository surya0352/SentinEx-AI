import { useState } from "react";

function CreateCase({ onBack, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    source: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const newCase = {
      id: `SE-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: form.title,
      status: "New",
      matches: 0,
      updated: "Just now",
    };

    setSubmitted(true);

    // Temporary frontend mock.
    // Later this will call your teammate's FastAPI API.
    setTimeout(() => {
      onCreated(newCase);
    }, 3000);
  }

  if (submitted) {
    return (
      <div className="case-page">
        <div className="success-card">
          <div className="success-icon">✓</div>

          <h1>Case Created</h1>

          <p>Your case workspace has been created successfully.</p>

          <button className="create-button" onClick={() => onCreated(null)}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="case-page">
      <div className="case-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>

        <div>
          <p className="welcome-small">CASE MANAGEMENT</p>
          <h1>Create New Case</h1>
        </div>
      </div>

      <div className="case-layout">
        <form className="case-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <p className="section-label">CASE INFORMATION</p>

            <h2>Start a new case</h2>

            <p className="form-description">
              Provide basic information about the situation. You can add
              evidence and analyze images after creating the case.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              Case title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Example: Image sharing case"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Briefly describe the situation..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="source">Known source or platform</label>

            <input
              id="source"
              name="source"
              type="text"
              placeholder="Example: Social media platform"
              value={form.source}
              onChange={handleChange}
            />
          </div>

          <div className="privacy-box">
            <span>🔒</span>

            <div>
              <strong>Privacy reminder</strong>

              <p>
                Only provide information you are authorized to submit. Avoid
                sharing unnecessary personal information.
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={onBack}>
              Cancel
            </button>

            <button type="submit" className="create-button">
              Create Case →
            </button>
          </div>
        </form>

        <div className="case-info-card">
          <div className="info-icon">🛡️</div>

          <h3>What happens next?</h3>

          <div className="info-step">
            <span>01</span>
            <p>Create your secure case workspace.</p>
          </div>

          <div className="info-step">
            <span>02</span>
            <p>Submit an image you are authorized to analyze.</p>
          </div>

          <div className="info-step">
            <span>03</span>
            <p>Generate a fingerprint and review potential matches.</p>
          </div>

          <div className="info-step">
            <span>04</span>
            <p>Organize evidence and prepare reporting actions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCase;
