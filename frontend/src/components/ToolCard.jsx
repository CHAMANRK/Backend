import { useNavigate } from 'react-router-dom'

export default function ToolCard({ emoji, title, description, path }) {
  const navigate = useNavigate()
  return (
    <div className="glass-card tool-card" onClick={() => navigate(path)}>
      <div style={{ fontSize: '2rem' }}>{emoji}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
