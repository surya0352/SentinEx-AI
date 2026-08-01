import { useState } from "react";
import "./App.css";
import CreateCase from "./CreateCase";
import AnalyzeImage from "./AnalyzeImage";
import AnalyzeVideo from "./AnalyzeVideo";

function App() {
  const [page, setPage] = useState("dashboard");

  const cases = [
    {
      id: "SE-2026-001",
      title: "Image Monitoring Case",
      status: "Monitoring",
      matches: 3,
      updated: "Today",
    },
    {
      id: "SE-2026-002",
      title: "Potential Image Match",
      status: "Review",
      matches: 1,
      updated: "Yesterday",
    },
    {
      id: "SE-2026-003",
      title: "Evidence Collection",
      status: "Evidence",
      matches: 0,
      updated: "2 days ago",
    },
  ];

  if (page === "create-case") {
    return (
      <CreateCase
        onBack={() => setPage("dashboard")}
        onCreated={() => setPage("dashboard")}
      />
    );
  }

  if (page === "analyze") {
    return <AnalyzeImage onBack={() => setPage("dashboard")} />;
  }

  if (page === "video") {
    return <AnalyzeVideo onBack={() => setPage("dashboard")} />;
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>SentinEx AI</span>
        </div>

        <nav className="side-nav">
          <a className="active" href="#">
            <span>⌂</span>
            Dashboard
          </a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage("create-case");
            }}
          >
            <span>＋</span>
            New Case
          </a>

          <a href="#">
            <span>◉</span>
            My Cases
          </a>

          <a href="#">
            <span>▣</span>
            Evidence
          </a>

          <a href="#">
            <span>▤</span>
            Reports
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a href="#">⚙ Settings</a>
          <a href="#">? Help & Safety</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top bar */}
        <header className="topbar">
          <div>
            <p className="welcome-small">SECURE CASE WORKSPACE</p>
            <h1>Dashboard</h1>
          </div>

          <div className="profile">
            <div className="notification">🔔</div>
            <div className="avatar">U</div>
            <span>User</span>
          </div>
        </header>

        {/* Welcome */}
        <section className="welcome-card">
          <div>
            <span className="secure-tag">🔐 Privacy-first workspace</span>

            <h2>Welcome to SentinEx AI</h2>

            <p>
              Manage your cases, review potential image matches, organize
              evidence, and prepare reporting actions from one secure workspace.
            </p>

            <button
              className="create-button"
              onClick={() => setPage("create-case")}
            >
              + Create New Case
            </button>
          </div>

          <div className="shield">🛡️</div>
        </section>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📁</span>
            <div>
              <p>Active Cases</p>
              <strong>3</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🔎</span>
            <div>
              <p>Potential Matches</p>
              <strong>4</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <div>
              <p>Evidence Items</p>
              <strong>12</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <div>
              <p>Reports</p>
              <strong>2</strong>
            </div>
          </div>
        </section>

        {/* Cases */}
        <section className="cases-section">
          <div className="section-title">
            <div>
              <p className="section-label">CASE MANAGEMENT</p>
              <h2>Recent Cases</h2>
            </div>

            <button className="view-button">View All →</button>
          </div>

          <div className="case-list">
            {cases.map((item) => (
              <div className="case-card" key={item.id}>
                <div className="case-left">
                  <div className="case-icon">📁</div>

                  <div>
                    <h3>{item.title}</h3>

                    <p>
                      {item.id} · Updated {item.updated}
                    </p>
                  </div>
                </div>

                <div className="case-middle">
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>

                  <span className="match-count">
                    {item.matches} potential match
                    {item.matches !== 1 ? "es" : ""}
                  </span>
                </div>

                <button className="open-case">Open →</button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-section">
          <p className="section-label">QUICK ACTIONS</p>

          <div className="quick-grid">
            <button
              className="quick-card"
              onClick={() => setPage("create-case")}
            >
              <span>+</span>

              <div>
                <strong>Create New Case</strong>
                <small>Start a new case workspace</small>
              </div>
            </button>

            <button className="quick-card" onClick={() => setPage("video")}>
              <span>▶</span>

              <div>
                <strong>Analyze Video</strong>
                <small>Submit a video for analysis</small>
              </div>
            </button>

            <button className="quick-card" onClick={() => setPage("analyze")}>
              <span>↑</span>

              <div>
                <strong>Analyze Image</strong>
                <small>Submit an image for analysis</small>
              </div>
            </button>
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="privacy-notice">
          <span>🔒</span>

          <div>
            <strong>Your privacy matters</strong>

            <p>
              Sensitive case information should only be accessed by authorized
              users. Never upload content you do not have permission to process.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
