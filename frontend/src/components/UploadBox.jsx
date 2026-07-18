export default function UploadBox({ onFileSelect, accept, label }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
    </div>
  )
}
