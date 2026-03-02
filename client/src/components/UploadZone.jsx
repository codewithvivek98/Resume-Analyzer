import { useRef, useState } from "react";

// Validate by file EXTENSION — Windows often reports wrong MIME type
function getExt(name) { return name.split(".").pop().toLowerCase(); }
function validFile(f) { return ["pdf","docx"].includes(getExt(f.name)); }
function fmtSize(b) {
  if (b < 1024)       return b + " B";
  if (b < 1048576)    return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

export default function UploadZone({ file, onFile, onAnalyze, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localErr, setLocalErr] = useState("");

  const pick = (fileList) => {
    const f = fileList?.[0];
    if (!f) return;
    if (!validFile(f)) {
      setLocalErr("Invalid file. Please upload a PDF or DOCX only.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setLocalErr("File too large — maximum size is 10 MB.");
      return;
    }
    setLocalErr("");
    onFile(f);
  };

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";  // allow re-selecting same file
      inputRef.current.click();
    }
  };

  const displayErr = localErr || error;

  return (
    <div className="upload-wrap">

      {/* Drop zone */}
      <div
        className={`dropbox${dragging ? " is-over" : ""}`}
        onClick={openPicker}
        onDragOver={e  => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files); }}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && openPicker()}
        aria-label="Click or drag to upload resume"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          style={{ display: "none" }}
          onChange={e => pick(e.target.files)}
        />

        <span className="drop-icon">
          {dragging ? "📂" : file ? "✅" : "📄"}
        </span>

        {!file ? (
          <>
            <p className="drop-title">Drop your resume here</p>
            <p className="drop-hint">PDF or DOCX — up to 10 MB</p>
            <button
              className="btn-pick"
              onClick={e => { e.stopPropagation(); openPicker(); }}
            >
              Browse Files
            </button>
          </>
        ) : (
          <>
            <p className="drop-title">File selected ✓</p>
            <div className="file-row">
              <span className="file-emoji">
                {getExt(file.name) === "pdf" ? "📋" : "📝"}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="file-name">{file.name}</div>
                <div className="file-size">{fmtSize(file.size)}</div>
              </div>
              <button
                className="btn-remove"
                title="Remove file"
                onClick={e => {
                  e.stopPropagation();
                  onFile(null);
                  setLocalErr("");
                }}
              >
                ×
              </button>
            </div>
            <p className="drop-hint-sm">Click here to change the file</p>
          </>
        )}
      </div>

      {/* Error */}
      {displayErr && (
        <div className="err-box">
          <span>⚠️</span>
          <span>{displayErr}</span>
        </div>
      )}

      {/* Analyze button */}
      <button
        className="btn-analyze"
        onClick={onAnalyze}
        disabled={!file}
      >
        🔍 Analyze Resume
      </button>

      <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
        Files are deleted immediately after analysis
      </p>
    </div>
  );
}
