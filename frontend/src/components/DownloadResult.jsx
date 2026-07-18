export default function DownloadResult({ blobUrl, filename, isImage }) {
  if (!blobUrl) return null

  return (
    <div className="result-box">
      {isImage && <img src={blobUrl} alt="result" />}
      <div style={{ marginTop: 10 }}>
        <a href={blobUrl} download={filename}>
          <button>Download</button>
        </a>
      </div>
    </div>
  )
}
