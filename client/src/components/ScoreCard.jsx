import { useEffect, useState } from "react";

const CIRC = 2 * Math.PI * 65; // stroke-dasharray value

function gradeOf(s) {
  if (s >= 80) return { text: "🏆 Excellent", cls: "gb-excellent" };
  if (s >= 60) return { text: "👍 Good",      cls: "gb-good"      };
  if (s >= 40) return { text: "⚡ Fair",       cls: "gb-fair"      };
  return             { text: "⚠️ Needs Work", cls: "gb-poor"      };
}

function colorOf(s) {
  if (s >= 80) return "#2d6a4f";
  if (s >= 60) return "#1d4e89";
  if (s >= 40) return "#d4820a";
  return "#c84b31";
}

export default function ScoreCard({ score, wordCount, sections }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 150); return () => clearTimeout(t); }, [score]);

  const grade  = gradeOf(score);
  const color  = colorOf(score);
  const offset = animated ? CIRC * (1 - score / 100) : CIRC;
  const secKeys = Object.keys(sections || {});

  return (
    <>
      {/* ── Circular score ── */}
      <div className="card score-card">
        <div className="card-label">Resume Score</div>

        <div className="score-circle">
          <svg width="156" height="156" viewBox="0 0 156 156">
            <circle className="sc-bg"   cx="78" cy="78" r="65" />
            <circle
              className="sc-fill"
              cx="78" cy="78" r="65"
              stroke={color}
              style={{ strokeDashoffset: offset }}
            />
          </svg>
          <div className="score-label">
            <span className="score-num">{score}</span>
            <span className="score-denom">/ 100</span>
          </div>
        </div>

        <div className={`grade-badge ${grade.cls}`}>{grade.text}</div>

        <div className="pbar-group">
          <div className="pbar-header">
            <span>Score Progress</span>
            <span style={{ color }}>{score}%</span>
          </div>
          <div className="pbar-track">
            <div
              className="pbar-fill"
              style={{
                width:           animated ? score + "%" : "0%",
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Word count ── */}
      <div className="card">
        <div className="card-label">Content Volume</div>
        <div>
          <span className="stat-num">{wordCount || 0}</span>
          <span className="stat-unit">words</span>
        </div>
        <p className="stat-hint">
          {(wordCount || 0) >= 500
            ? "✅ Great depth"
            : (wordCount || 0) >= 300
            ? "⚡ Decent — consider expanding"
            : "⚠️ Too short — aim for 400+ words"}
        </p>
      </div>

      {/* ── Sections detected ── */}
      {secKeys.length > 0 && (
        <div className="card">
          <div className="card-label">
            Sections ({secKeys.filter(k => sections[k]).length}/{secKeys.length} found)
          </div>
          <div className="sec-grid">
            {secKeys.map(k => (
              <div className="sec-row" key={k}>
                <div className={`sec-dot ${sections[k] ? "yes" : "no"}`} />
                <span style={{ textTransform: "capitalize" }}>{k}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
