import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import QRGenerator from './pages/QRGenerator.jsx'
import PDFToolkit from './pages/PDFToolkit.jsx'
import BGRemover from './pages/BGRemover.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qr" element={<QRGenerator />} />
          <Route path="/pdf" element={<PDFToolkit />} />
          <Route path="/bg-remover" element={<BGRemover />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
