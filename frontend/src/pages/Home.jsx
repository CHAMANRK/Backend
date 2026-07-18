import ToolCard from '../components/ToolCard.jsx'

export default function Home() {
  return (
    <div>
      <h1>🛠️ Nano Tools Hub</h1>
      <p>Free utility tools. No sign up, no subscription.</p>
      <div className="tool-grid">
        <ToolCard
          emoji="🔲"
          title="QR Generator"
          description="Normal & art/styled QR codes"
          path="/qr"
        />
        <ToolCard
          emoji="📄"
          title="PDF Toolkit"
          description="Lock, unlock, watermark PDFs"
          path="/pdf"
        />
        <ToolCard
          emoji="🖼️"
          title="BG Remover"
          description="Remove image background"
          path="/bg-remover"
        />
      </div>
    </div>
  )
}
