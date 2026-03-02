import { useState, useEffect } from "react";
import Header        from "./components/Header.jsx";
import UploadZone    from "./components/UploadZone.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Dashboard     from "./components/Dashboard.jsx";
import History       from "./components/History.jsx";

const PILLS = ["💻 Tech","🏥 Healthcare","💰 Finance","📣 Marketing",
               "📚 Education","🎨 Design","⚖️ Legal","👥 HR","🤝 Sales","⚙️ Ops"];

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("riq-theme") === "dark");
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("riq-history") || "[]"); }
    catch { return []; }
  });

  // Apply dark mode to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("riq-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("riq-history", JSON.stringify(history));
  }, [history]);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const fd = new FormData();
    fd.append("resume", file);

    try {
      const res  = await fetch("/analyze-resume", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");

      setResult(data);
      const entry = {
        id: Date.now(),
        filename: file.name,
        score: data.score,
        industryLabel: data.industryLabel,
        industryEmoji: data.industryEmoji,
        foundSkills:   data.foundSkills,
        missingSkills: data.missingSkills,
        softSkills:    data.softSkills,
        suggestions:   data.suggestions,
        meta:          data.meta,
        analyzedAt:    new Date().toISOString(),
      };
      setHistory(prev => [entry, ...prev].slice(0, 10));
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div>
      <Header dark={dark} onToggle={() => setDark(d => !d)} />

      {/* ── UPLOAD SCREEN ── */}
      {!result && !loading && (
        <>
          <div className="hero">
            <div className="hero-pill">
              <span className="hero-dot" />
              AI-Powered · All Industries
            </div>
            <h1 className="hero-title">
              Analyze Your<br />
              <em>Resume Score</em>
            </h1>
            <p className="hero-sub">
              Works for every profession — Tech, Healthcare, Finance,
              Marketing, Legal, Education, HR, Sales and more.
            </p>
            <div className="ind-row">
              {PILLS.map(p => <span key={p} className="ind-pill">{p}</span>)}
            </div>
          </div>

          <UploadZone
            file={file}
            onFile={setFile}
            onAnalyze={analyze}
            error={error}
          />
        </>
      )}

      {/* ── LOADING ── */}
      {loading && <LoadingSpinner />}

      {/* ── RESULTS ── */}
      {result && !loading && (
        <div className="page-wrap">
          <Dashboard result={result} onReset={reset} />
        </div>
      )}

      {/* ── HISTORY ── */}
      {history.length > 0 && !loading && (
        <History
          history={history}
          onSelect={item => setResult(item)}
          onClear={() => setHistory([])}
        />
      )}
    </div>
  );
}
