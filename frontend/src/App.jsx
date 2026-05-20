import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import SiteDetail from './pages/SiteDetail'
import GraphPage from './pages/GraphPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/browse"     element={<Browse />} />
          <Route path="/site/:id"   element={<SiteDetail />} />
          <Route path="/graph"      element={<GraphPage />} />
          <Route path="/chat"       element={<ChatPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
