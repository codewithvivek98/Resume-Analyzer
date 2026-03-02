export default function Header({ dark, onToggle }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">

        {/* Brand / Logo */}
        <div className="brand">
          <div className="brand-icon">RI</div>
          <div className="brand-name">
            Resume<span>IQ</span>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="header-right">
          <span className="theme-label">
            {dark ? "🌙 Dark" : "☀️ Light"}
          </span>
          <button
            className="theme-btn"
            onClick={onToggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          />
        </div>

      </div>
    </header>
  );
}
