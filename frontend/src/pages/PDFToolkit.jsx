import { useState } from 'react'
import { Link } from 'react-router-dom'
import UploadBox from '../components/UploadBox.jsx'
import DownloadResult from '../components/DownloadResult.jsx'
import { apiPost } from '../api.js'

const ACTIONS = {
  lock: { label: 'Lock (add password)', endpoint: '/api/pdf/lock', field: 'password', placeholder: 'Set a password' },
  unlock: { label: 'Unlock (remove password)', endpoint: '/api/pdf/unlock', field: 'password', placeholder: 'Enter current password' },
  watermark: { label: 'Add watermark', endpoint: '/api/pdf/watermark', field: 'text', placeholder: 'Watermark text' },
}

export default function PDFToolkit() {
  const [action, setAction] = useState('lock')
  const [file, setFile] = useState(null)
  const [fieldValue, setFieldValue] = useState('')
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const current = ACTIONS[action]

  async function handleRun() {
    if (!file || !fieldValue) {
      setError('Upload a PDF and fill the field above')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(current.field, fieldValue)
      const blob = await apiPost(current.endpoint, formData)
      setResultUrl(URL.createObjectURL(blob))
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <Link to="/" className="back-link">← Back</Link>
      <div className="glass-card">
        <h2>📄 PDF Toolkit</h2>

        <div style={{ marginBottom: 12 }}>
          {Object.entries(ACTIONS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setAction(key); setResultUrl(null) }}
              style={{ marginRight: 8, marginBottom: 8, opacity: action === key ? 1 : 0.5 }}
            >
              {val.label}
            </button>
          ))}
        </div>

        <UploadBox label="Upload PDF" accept="application/pdf" onFileSelect={setFile} />

        <input
          type={action === 'lock' || action === 'unlock' ? 'password' : 'text'}
          placeholder={current.placeholder}
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
        />

        <button onClick={handleRun} disabled={loading}>
          {loading ? 'Processing...' : 'Run'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <DownloadResult blobUrl={resultUrl} filename="result.pdf" isImage={false} />
      </div>
    </div>
  )
}
