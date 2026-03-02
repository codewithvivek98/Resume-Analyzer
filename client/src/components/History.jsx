function scoreColor(s) {
  if (s >= 80) return "#2d6a4f";
  if (s >= 60) return "#1d4e89";
  if (s >= 40) return "#d4820a";
  return "#c84b31";
}

export default function History({ history, onSelect, onClear }) {
  if (!history?.length) return null;

  return (
    <div className="history-panel">
      <div className="history-panel-head">
        <h3>📁 Recent Analyses</h3>
        <button className="btn-clear-hist" onClick={onClear}>Clear all</button>
      </div>
      <div className="history-scroll">
        {history.map(item => (
          <div
            key={item.id}
            className="hist-card"
            onClick={() => onSelect(item)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && onSelect(item)}
          >
            <div className="hist-file">{item.filename}</div>
            <div
              className="hist-score"
              style={{ color: scoreColor(item.score) }}
            >
              {item.score}
            </div>
            <div className="hist-date">
              {item.analyzedAt
                ? new Date(item.analyzedAt).toLocaleString(undefined, {
                    month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
