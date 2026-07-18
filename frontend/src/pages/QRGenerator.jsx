import { useState } from 'react'
import { Link } from 'react-router-dom'
import UploadBox from '../components/UploadBox.jsx'
import DownloadResult from '../components/DownloadResult.jsx'
import { apiPost } from '../api.js'

export default function QRGenerator() {
  const [text, setText] = useState('')
  const [logo, setLogo] = useState(null)
  const [mode, setMode] = useState('normal') // 'normal' or 'art'
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!text) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('text', text)

      let blob
      if (mode === 'art') {
        if (!logo) {
          setError('Please upload a logo/image for art QR')
          setLoading(false)
          return
        }
        formData.append('logo', logo)
        blob = await apiPost('/api/qr/art', formData)
      } else {
        blob = await apiPost('/api/qr/generate', formData)
      }
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
        <h2>🔲 QR Generator</h2>

        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setMode('normal')}
            style={{ marginRight: 8, opacity: mode === 'normal' ? 1 : 0.5 }}
          >
            Normal QR
          </button>
          <button
            onClick={() => setMode('art')}
            style={{ opacity: mode === 'art' ? 1 : 0.5 }}
          >
            Art QR
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter URL or text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {mode === 'art' && (
          <UploadBox
            label="Upload logo/image"
            accept="image/*"
            onFileSelect={setLogo}
          />
        )}

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate QR'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <DownloadResult blobUrl={resultUrl} filename="qr-code.png" isImage />
      </div>
    </div>
  )
}
