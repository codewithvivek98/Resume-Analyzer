export default function LoadingSpinner() {
  return (
    <div className="loading-box">
      <div className="spin-ring" />
      <h3>Analyzing your resume…</h3>
      <p>
        Detecting industry &amp; skills
        <span className="ldots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
