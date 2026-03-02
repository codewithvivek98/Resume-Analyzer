export default function SkillsList({ foundSkills = [], missingSkills = [], softSkills = [], industryLabel = "" }) {
  return (
    <div className="card">
      <div className="card-label">Skills Analysis — {industryLabel}</div>

      {foundSkills.length > 0 && (
        <div className="skills-block">
          <h4>✅ Detected ({foundSkills.length})</h4>
          <div className="chip-row">
            {foundSkills.map((s, i) => (
              <span
                key={s}
                className="chip chip-found"
                style={{ animationDelay: i * 35 + "ms" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="skills-block">
          <h4>⬜ Missing ({missingSkills.length})</h4>
          <div className="chip-row">
            {missingSkills.map((s, i) => (
              <span
                key={s}
                className="chip chip-missing"
                style={{ animationDelay: (foundSkills.length + i) * 35 + "ms" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {softSkills.length > 0 && (
        <div className="skills-block">
          <h4>🌟 Soft Skills ({softSkills.length})</h4>
          <div className="chip-row">
            {softSkills.map((s, i) => (
              <span
                key={s}
                className="chip chip-soft"
                style={{
                  animationDelay: i * 35 + "ms",
                  textTransform: "capitalize",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
