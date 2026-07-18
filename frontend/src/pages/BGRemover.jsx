import { useState } from 'react'
import { Link } from 'react-router-dom'
import UploadBox from '../components/UploadBox.jsx'
import DownloadResult from '../components/DownloadResult.jsx'
import { apiPost } from '../api.js'

export default function BGRemover() {
  const [file, setFile] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRemove() {
    if (!file) {
      setError('Upload an image first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const blob = await apiPost('/api/bg/remove', formData)
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
        <h2>🖼️ Background Remover</h2>

        <UploadBox label="Upload image" accept="image/*" onFileSelect={setFile} />

        <button onClick={handleRemove} disabled={loading}>
          {loading ? 'Removing background...' : 'Remove Background'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <DownloadResult blobUrl={resultUrl} filename="no-bg.png" isImage />
      </div>
    </div>
  )
}
