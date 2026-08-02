import { useState } from "react";
import "./App.css";
import CreateCase from "./CreateCase";
import AnalyzeImage from "./AnalyzeImage";
import AnalyzeVideo from "./AnalyzeVideo";
import CaseWorkspace from "./CaseWorkspace";
import MyCases from "./MyCases";
import Reports from "./Reports";

function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedCase, setSelectedCase] = useState(null);

  // MEMORY: Store our cases
  const [myCases, setMyCases] = useState([
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
  ]);

  // MEMORY: Store our generated PDFs/Reports
  const [myReports, setMyReports] = useState([]);

  // FUNCTIONS to update memory
  function handleCaseCreated(newCase) {
    if (newCase) {
      setMyCases([newCase, ...myCases]);
      setSelectedCase(newCase);
      setPage("workspace");
    } else {
      setPage("dashboard");
    }
  }

  function handleReportGenerated(reportData) {
    setMyReports([reportData, ...myReports]);
  }

  // --- DELETE CASE FUNCTION ---
  function handleDeleteCase(caseIdToDelete) {
    // 1. Keep only the cases that DO NOT match the ID we want to delete
    const updatedCases = myCases.filter((c) => c.id !== caseIdToDelete);
    setMyCases(updatedCases);

    // 2. If the user was looking at the case they just deleted, kick them back to the dashboard
    if (selectedCase && selectedCase.id === caseIdToDelete) {
      setPage("dashboard");
      setSelectedCase(null);
    }
  }

  // --- DELETE REPORT FUNCTION ---
  function handleDeleteReport(reportIdToDelete) {
    const updatedReports = myReports.filter((r) => r.id !== reportIdToDelete);
    setMyReports(updatedReports);
  }

  // --- ROUTING ---

  if (page === "create-case") {
    return (
      <CreateCase 
        onBack={() => setPage("dashboard")} 
        onCreated={handleCaseCreated} 
      />
    );
  }

  if (page === "workspace") {
    return (
      <CaseWorkspace
        caseData={selectedCase}
        onBack={() => setPage("dashboard")}
        onAnalyzeImage={() => setPage("analyze")}
        onAnalyzeVideo={() => setPage("video")}
        onReportGenerated={handleReportGenerated}
      />
    );
  }

  if (page === "analyze") {
    return <AnalyzeImage onBack={() => setPage("dashboard")} />;
  }

  if (page === "video") {
    return <AnalyzeVideo onBack={() => setPage("dashboard")} />;
  }

  if (page === "my-cases") {
    return (
      <MyCases 
        cases={myCases} 
        onBack={() => setPage("dashboard")} 
        onOpenCase={(item) => {
          setSelectedCase(item);
          setPage("workspace");
        }} 
        // Pass the delete function down!
        onDeleteCase={handleDeleteCase} 
      />
    );
  }

  if (page === "reports") {
    return (
      <Reports 
        reports={myReports} 
        onBack={() => setPage("dashboard")} 
        onDeleteReport={handleDeleteReport} 
      />
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>SentinEx AI</span>
        </div>
        <nav className="side-nav">
          <a className="active" href="#">
            <span>⌂</span> Dashboard
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setPage("create-case"); }}>
            <span>＋</span> New Case
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setPage("my-cases"); }}>
            <span>◉</span> My Cases ({myCases.length})
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); setPage("reports"); }}>
            <span>▤</span> Reports ({myReports.length})
          </a>  
        </nav>
        <div className="sidebar-bottom">
          <a href="#">⚙ Settings</a>
          <a href="#">? Help & Safety</a>
        </div>
      </aside>

      <main className="dashboard-main">
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

        <section className="welcome-card">
          <div>
            <span className="secure-tag">🔐 Privacy-first workspace</span>
            <h2>Welcome to SentinEx AI</h2>
            <p>Manage your cases, review potential image matches, organize evidence, and prepare reporting actions from one secure workspace.</p>
            <button className="create-button" onClick={() => setPage("create-case")}>
              + Create New Case
            </button>
          </div>
          <div className="shield">🛡️</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📁</span>
            <div>
              <p>Active Cases</p>
              <strong>{myCases.length}</strong>
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
              <strong>{myReports.length + 2}</strong>
            </div>
          </div>
        </section>

        <section className="cases-section">
          <div className="section-title">
            <div>
              <p className="section-label">CASE MANAGEMENT</p>
              <h2>Recent Cases</h2>
            </div>
            <button className="view-button" onClick={() => setPage("my-cases")}>
              View All →
            </button>
          </div>

          <div className="case-list">
            {myCases.map((item) => (
              <div className="case-card" key={item.id}>
                <div className="case-left">
                  <div className="case-icon">📁</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.id} · Updated {item.updated}</p>
                  </div>
                </div>
                <div className="case-middle">
                  <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                  <span className="match-count">
                    {item.matches} potential match{item.matches !== 1 ? "es" : ""}
                  </span>
                </div>
                <button className="open-case" onClick={() => { setSelectedCase(item); setPage("workspace"); }}>
                  Open →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="quick-section">
          <p className="section-label">QUICK ACTIONS</p>
          <div className="quick-grid">
            <button className="quick-card" onClick={() => setPage("create-case")}>
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

        <div className="privacy-notice">
          <span>🔒</span>
          <div>
            <strong>Your privacy matters</strong>
            <p>Sensitive case information should only be accessed by authorized users. Never upload content you do not have permission to process.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;