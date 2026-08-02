import React, { useState } from "react";

function MyCases({ cases, onBack, onOpenCase, onDeleteCase }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="case-workspace">
      <div className="workspace-top">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <span className="case-label">CASE MANAGEMENT</span>
        <h1>My Cases</h1>
        <p className="case-id">View, search, and manage all your secure case workspaces.</p>
      </div>

      <div className="workspace-card" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <input
          type="text"
          placeholder="🔍 Search cases by ID or Title..."
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

        <div className="case-list">
          {filteredCases.map((item) => (
            <div className="case-card" key={item.id}>
              
              <div className="case-left">
                <div className="case-icon">📁</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.id} · Updated {item.updated}</p>
                </div>
              </div>

              <div className="case-middle">
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
                <span className="match-count">
                  {item.matches} potential match{item.matches !== 1 ? "es" : ""}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  className="open-case" 
                  onClick={() => onOpenCase(item)}
                >
                  Open →
                </button>
                
                {/* NEW DELETE BUTTON */}
                <button 
                  className="open-case" 
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  onClick={() => {
                    // Optional: Add a quick confirmation so they don't delete by accident
                    if (window.confirm("Are you sure you want to permanently delete this case?")) {
                      onDeleteCase(item.id);
                    }
                  }}
                >
                  Delete 🗑️
                </button>
              </div>
              
            </div>
          ))}

          {filteredCases.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#858e9f" }}>
              <span style={{ fontSize: "30px", display: "block", marginBottom: "10px" }}>📭</span>
              <strong>No cases found.</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCases;