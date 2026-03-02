import ScoreCard from "./ScoreCard.jsx";
import SkillsList from "./SkillsList.jsx";

function colorOf(s) {
  if (s >= 80) return "#2d6a4f";
  if (s >= 60) return "#1d4e89";
  if (s >= 40) return "#d4820a";
  return "#c84b31";
}

const CORE_COUNT = 11; // number of core skills in backend

export default function Dashboard({ result, onReset }) {
  const {
    score         = 0,
    industryLabel = "General",
    industryEmoji = "📄",
    foundSkills   = [],
    missingSkills = [],
    softSkills    = [],
    suggestions   = [],
    meta          = {},
  } = result;

  const { filename, wordCount, sections = {}, analyzedAt } = meta;
  const secKeys  = Object.keys(sections);
  const secFound = secKeys.filter(k => sections[k]).length;
  const total    = foundSkills.length + missingSkills.length;

  const breakdown = [
    {
      label: "Industry Skills",
      val:   total > 0 ? Math.round((foundSkills.length / total) * 40) : 0,
      max: 40,
      color: "#2d6a4f",
    },
    {
      label: "Sections Present",
      val:   Math.round((secFound / Math.max(secKeys.length, 1)) * 40),
      max: 40,
      color: "#1d4e89",
    },
    {
      label: "Content Richness",
      val:   Math.min(20, Math.round(((wordCount || 0) / 800) * 20)),
      max: 20,
      color: "#d4820a",
    },
  ];

  return (
    <div className="dashboard">

      {/* Top bar */}
      <div className="dash-top">
        <div>
          <div className="dash-heading">Analysis Results</div>
          <div className="dash-meta">
            📄 {filename || "Resume"}
            {analyzedAt ? " · " + new Date(analyzedAt).toLocaleString() : ""}
          </div>
        </div>
        <button className="btn-back" onClick={onReset}>↩ Analyze Another</button>
      </div>

      {/* Industry banner */}
      <div className="ind-banner">
        <span className="ind-banner-emoji">{industryEmoji}</span>
        <div>
          <div className="ind-banner-label">Detected Industry</div>
          <div className="ind-banner-name">{industryLabel}</div>
        </div>
        <div className="ind-banner-stats">
          <div className="ind-stat-num">
            {foundSkills.length}/{total || "—"}
          </div>
          <div className="ind-stat-lbl">skills matched</div>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="dash-grid">

        {/* Left column: score + stats */}
        <div className="dash-left">
          <ScoreCard score={score} wordCount={wordCount} sections={sections} />
        </div>

        {/* Right column: skills + suggestions + breakdown */}
        <div className="dash-right">

          <SkillsList
            foundSkills={foundSkills}
            missingSkills={missingSkills}
            softSkills={softSkills}
            industryLabel={industryLabel}
          />

          {suggestions.length > 0 && (
            <div className="card">
              <div className="card-label">Improvement Suggestions</div>
              <div className="tip-list">
                {suggestions.map((tip, i) => (
                  <div
                    className="tip"
                    key={i}
                    style={{ animationDelay: i * 70 + "ms" }}
                  >
                    <span className="tip-icon">💡</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-label">Score Breakdown</div>
            <div className="breakdown">
              {breakdown.map(({ label, val, max, color }) => (
                <div key={label}>
                  <div className="pbar-header">
                    <span>{label}</span>
                    <span style={{ color, fontWeight: 600 }}>{val} / {max}</span>
                  </div>
                  <div className="pbar-track">
                    <div
                      className="pbar-fill"
                      style={{
                        width: (val / max * 100) + "%",
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
