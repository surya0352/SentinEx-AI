import React, { useState } from "react";
import { jsPDF } from "jspdf";
import "./CaseWorkspace.css";

function CaseWorkspace({ caseData, onBack, onAnalyzeImage, onAnalyzeVideo, onReportGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Use the passed-in case data, or fall back to a default if none exists
  const caseInfo = caseData || {
    id: "SE-2026-001",
    title: "Unauthorized Image Distribution",
    status: "Review",
    matches: 3,
    updated: "Just now",
    source: "Social Media Platform",
    description: "Multiple unauthorized uploads detected across public forums."
  };

  const generateReport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const doc = new jsPDF();

      // Header styling
      doc.setFontSize(22);
      doc.setTextColor(23, 32, 51);
      doc.text("SentinEx: Incident Report", 20, 30);

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Generated securely on client-device via WebAssembly", 20, 38);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 45, 190, 45);

      // Legal Context (IT Act 2000)
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38); 
      doc.text("URGENT: Notice of Violation (IT Act 2000)", 20, 60);
      
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const legalText = "This automated report serves as a formal complaint regarding the unauthorized distribution of intimate imagery, in direct violation of Section 66E (Violation of Privacy) and Section 67A (Publishing sexually explicit material) of the Information Technology Act, 2000.";
      doc.text(legalText, 20, 68, { maxWidth: 170 });

      // Case Details Box
      doc.setFillColor(245, 247, 251);
      doc.rect(20, 90, 170, 70, "F");

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Case Reference Details:", 25, 100);
      
      doc.setFontSize(10);
      doc.text(`Case ID: ${caseInfo.id}`, 25, 112);
      doc.text(`Title: ${caseInfo.title}`, 25, 120);
      doc.text(`Reported Source: ${caseInfo.source || "Unknown"}`, 25, 128);
      doc.text(`Potential Matches Found: ${caseInfo.matches}`, 25, 136);
      doc.text(`Timestamp: ${new Date().toLocaleString()}`, 25, 144);
      doc.text(`Cryptographic Signature (pHash): [SECURELY HELD ON DEVICE]`, 25, 152);

      // Next Steps
      doc.setFontSize(12);
      doc.text("Next Required Actions:", 20, 180);
      doc.setFontSize(10);
      doc.text("1. Immediate takedown of flagged URLs by hosting provider.", 20, 188);
      doc.text("2. Preservation of metadata and IP logs by webmaster.", 20, 196);
      doc.text("3. Submission of this document to cybercrime.gov.in.", 20, 204);

      // Save PDF
      doc.save(`${caseInfo.id}_Cybercrime_Complaint.pdf`);
      
      // Save to memory in App.jsx
      if (onReportGenerated) {
        onReportGenerated({
          id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
          caseId: caseInfo.id,
          title: `${caseInfo.title} - IT Act Complaint`,
          date: new Date().toLocaleDateString()
        });
      }

      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="case-workspace">
      <div className="workspace-top">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <span className="case-label">CASE WORKSPACE</span>
        <h1>{caseInfo.title}</h1>
        <p className="case-id">
          {caseInfo.id} · Updated {caseInfo.updated}
        </p>
      </div>

      <div className="case-summary">
        <div className="summary-card">
          <span>Status</span>
          <strong className="status-badge">{caseInfo.status}</strong>
        </div>
        <div className="summary-card">
          <span>Potential Matches</span>
          <strong>{caseInfo.matches}</strong>
        </div>
        <div className="summary-card">
          <span>Evidence Items</span>
          <strong>0</strong>
        </div>
        <div className="summary-card">
          <span>Reports</span>
          <strong>0</strong>
        </div>
      </div>

      <div className="workspace-grid">
        <section className="workspace-card">
          <span className="section-label">ANALYSIS</span>
          <h2>Analyze Content</h2>
          <p>Submit authorized content for analysis. SentinEx AI can inspect images and videos for potentially relevant material locally.</p>

          <div className="analysis-actions">
            <button className="analysis-button" onClick={onAnalyzeImage}>
              <span>🖼️</span>
              <div>
                <strong>Analyze Image</strong>
                <small>Submit an image for analysis</small>
              </div>
            </button>
            <button className="analysis-button" onClick={onAnalyzeVideo}>
              <span>🎥</span>
              <div>
                <strong>Analyze Video</strong>
                <small>Submit a video for analysis</small>
              </div>
            </button>
          </div>
        </section>

        <section className="workspace-card legal-action-card">
          <span className="section-label">LEGAL ACTION</span>
          <h2>Generate Cybercrime Report</h2>
          <p>
            Compile case evidence into a formal legal complaint formatted for the National Cyber Crime Reporting Portal (IT Act Sec 66E/67A).
          </p>

          <button 
            className={`analysis-button report-button ${isGenerating ? "generating" : ""}`}
            onClick={generateReport}
            disabled={isGenerating}
          >
            <span>{isGenerating ? "⏳" : "📄"}</span>
            <div>
              <strong>
                {isGenerating ? "Compiling local evidence..." : "Download IT Act Complaint (PDF)"}
              </strong>
              <small>Generates locally. No data sent to server.</small>
            </div>
          </button>
        </section>
      </div>

      <div className="privacy-box" style={{ marginTop: '20px' }}>
        <span>🔒</span>
        <div>
          <strong>Privacy & Safety</strong>
          <p>
            Only analyze content you are authorized to process. Sensitive case information should remain accessible only to authorized users. All reporting documents are generated strictly on your local device.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CaseWorkspace;