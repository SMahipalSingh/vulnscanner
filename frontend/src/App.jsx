import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SecureScanAI() {
  const [ip, setIp] = useState("");
  const [url, setUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [fadeResult, setFadeResult] = useState(false);
  const [fadeAI, setFadeAI] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleScan = async () => {
    if (!ip && !url) {
      setScanResult({ error: "⚠️ Please enter a URL or IP Address." });
      setFadeResult(true);
      return;
    }
    try {
      setScanResult({ status: "⏳ Scanning in progress..." });
      setAiSuggestions(null);
      setFadeResult(true);
      setFadeAI(false);

      const payload = {};
      if (ip) payload.ip = ip.trim();
      if (url) payload.url = url.trim();

      const res = await axios.post("/api/scan", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setScanResult(res.data.scan_results || {});
      setAiSuggestions(res.data.ai_suggestions || null);
      setFadeResult(true);
      setFadeAI(true);
    } catch (err) {
      setScanResult({
        error: "❌ Error scanning target. Make sure backend is running.",
      });
      setAiSuggestions(null);
      setFadeResult(true);
      setFadeAI(true);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #2c3e50",
    outline: "none",
    fontSize: "1rem",
    marginBottom: "20px",
    background: "#0d172b",
    color: "#e0e0e0",
    transition: "all 0.3s ease",
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "15px",
    color: "#fff",
    background: "linear-gradient(90deg, #00f5d4, #00bbf9)",
    transition: "all 0.3s ease",
  };

  const panelStyle = {
    background: "#111827",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    border: "1px solid #1f2a48",
    overflowY: "auto",
    transition: "all 0.4s ease",
  };

  const fadeStyle = { opacity: 1, transition: "opacity 0.5s ease-in" };
  const fadeOutStyle = { opacity: 0, transition: "opacity 0.5s ease-out" };

  const renderResults = () => {
    if (!scanResult) return "Scan results will appear here...";
    if (scanResult.error)
      return <p style={{ color: "#f87171" }}>{scanResult.error}</p>;
    if (scanResult.status) return <p>{scanResult.status}</p>;

    return (
      <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
        <p>
          <b>Target IP:</b> {scanResult.ip}
        </p>
        <p>
          <b>Open Ports:</b>{" "}
          {scanResult.open_ports?.length
            ? scanResult.open_ports.join(", ")
            : "No open ports"}
        </p>
        <p>
          <b>SQL Injection:</b>{" "}
          {scanResult.sqli?.sqli ? "❌ Vulnerable" : "✅ Safe"}
        </p>
        <p>
          <b>XSS:</b> {scanResult.xss?.xss ? "❌ Vulnerable" : "✅ Safe"}
        </p>
        <p>
          <b>Command Injection:</b>{" "}
          {scanResult.command_injection?.command_injection
            ? "❌ Vulnerable"
            : "✅ Safe"}
        </p>
        <p>
          <b>CSRF Protection:</b>{" "}
          {scanResult.csrf?.csrf_protection
            ? "✅ Enabled"
            : "❌ Not Enabled"}
        </p>
        <p>
          <b>SSL/TLS:</b>{" "}
          {scanResult.ssl_tls?.ssl ? "✅ Enabled" : "❌ Not Enabled"}
        </p>
      </div>
    );
  };

  const renderAISuggestions = () => {
    if (!aiSuggestions) return "AI analysis will appear here...";

    if (typeof aiSuggestions === "string") return <pre>{aiSuggestions}</pre>;

    const {
      vulnerabilities = [],
      recommendations = [],
      security_score = null,
    } = aiSuggestions;

    return (
      <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
        {security_score !== null && (
          <div style={{ marginBottom: "20px" }}>
            <b>🔒 Security Score:</b> {security_score}/10
            <div
              style={{
                background: "#333",
                borderRadius: "10px",
                overflow: "hidden",
                height: "15px",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  width: `${(security_score / 10) * 100}%`,
                  background:
                    security_score >= 7
                      ? "#10b981"
                      : security_score >= 4
                      ? "#f59e0b"
                      : "#ef4444",
                  height: "100%",
                }}
              ></div>
            </div>
          </div>
        )}

        <b>⚠️ Vulnerabilities:</b>
        <ul>
          {vulnerabilities.length ? (
            vulnerabilities.map((v, i) => <li key={i}>{v}</li>)
          ) : (
            <li>No major vulnerabilities detected.</li>
          )}
        </ul>

        <b>🛠️ Recommendations:</b>
        <ul>
          {recommendations.length ? (
            recommendations.map((r, i) => <li key={i}>{r}</li>)
          ) : (
            <li>No recommendations provided.</li>
          )}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#0a0f1e",
          color: "#00f5d4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          🔒 SecureScan AI
        </div>
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "8px solid #1f2a44",
            borderTop: "8px solid #00f5d4",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <h2 style={{ marginTop: "20px", animation: "fadeIn 2s ease-in-out" }}>
          Initializing SecureScan...
        </h2>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
          @keyframes fadeIn { 0% {opacity:0;} 100% {opacity:1;} }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#0a0f1e",
        fontFamily: "Segoe UI, sans-serif",
        color: "#e0e0e0",
        padding: "20px",
      }}
    >
      {!scanResult ? (
        // 🔹 Show input form full width before scanning
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              background: "#131c31",
              padding: "40px",
              borderRadius: "15px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
              width: "100%",
              maxWidth: "600px",
              textAlign: "center",
              border: "1px solid #1f2a48",
            }}
          >
            <h1
              style={{
                marginBottom: "20px",
                fontSize: "2rem",
                color: "#00f5d4",
                letterSpacing: "1px",
              }}
            >
              🔒 SecureScan AI
            </h1>
            <p style={{ marginBottom: "20px", opacity: "0.8" }}>
              Enter a <b>URL</b> or <b>IP Address</b> to begin security
              scanning
            </p>

            <input
              type="text"
              placeholder="Enter IP Address (e.g. 192.168.1.1)"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.border = "1px solid #00f5d4")
              }
              onBlur={(e) =>
                (e.target.style.border = "1px solid #2c3e75")
              }
            />
            <input
              type="text"
              placeholder="Enter URL (e.g. https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.border = "1px solid #00f5d4")
              }
              onBlur={(e) =>
                (e.target.style.border = "1px solid #2c3e75")
              }
            />

            <button onClick={handleScan} style={buttonStyle}>
              🚀 Start Scan + AI Suggestions
            </button>
          </div>
        </div>
      ) : (
        // 🔹 Show results full width after scanning
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            height: "100%",
          }}
        >
          <div style={{ ...panelStyle, ...(fadeResult ? fadeStyle : fadeOutStyle) }}>
            <h2 style={{ marginBottom: "10px", color: "#ff477e" }}>
              📊 Scan Output
            </h2>
            {renderResults()}
          </div>
          <div style={{ ...panelStyle, ...(fadeAI ? fadeStyle : fadeOutStyle) }}>
            <h2 style={{ marginBottom: "10px", color: "#00bbf9" }}>
              🤖 AI Suggestions
            </h2>
            {renderAISuggestions()}
          </div>
        </div>
      )}
    </div>
  );
}
