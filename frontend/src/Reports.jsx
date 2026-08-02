import React, { useState } from "react";

function Reports({ reports, onBack, onDeleteReport }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Search by Report ID, Case ID, or Title
  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="case-workspace">
      {/* Header Area */}
      <div className="workspace-top">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <span className="case-label">EVIDENCE LOCKER</span>
        <h1>Generated Reports</h1>
        <p className="case-id">View and manage legally formatted cybercrime complaints.</p>
      </div>

      {/* Main List Area */}
      <div className="workspace-card" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search reports by Case ID, Report ID, or Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "25px",
            background: "#090c12",
            border: "1px solid #293140",
            color: "white",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none"
          }}
        />

        {/* The List of Reports */}
        <div className="case-list">
          {filteredReports.map((item) => (
            <div className="case-card" key={item.id}>
              
              <div className="case-left">
                {/* Document Icon instead of Folder */}
                <div className="case-icon" style={{ background: "#172033", color: "#6175b7" }}>📄</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.id} · Linked to Case: <strong>{item.caseId}</strong> · Generated {item.date}</p>
                </div>
              </div>

              <div className="case-middle">
                <span className="status evidence" style={{ background: "#173428", color: "#10b981" }}>
                  Verified Local PDF
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  className="open-case" 
                  onClick={() => alert("In a live app, this would re-download the saved PDF document.")}
                >
                  Download ↓
                </button>
                
                <button 
                  className="open-case" 
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to permanently delete this report?")) {
                      onDeleteReport(item.id);
                    }
                  }}
                >
                  Delete 🗑️
                </button>
              </div>
              
            </div>
          ))}

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#858e9f" }}>
              <span style={{ fontSize: "30px", display: "block", marginBottom: "10px" }}>📭</span>
              <strong>No reports found.</strong>
              <p style={{ marginTop: "5px", fontSize: "12px" }}>Open a case and click "Generate Cybercrime Report" to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;