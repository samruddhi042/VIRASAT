import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SITES_DATA } from '../data/sites'

const NODE_COLORS = { site: '#A0720A', state: '#2E7D32', category: '#1565C0', keyword: '#880E4F' }
const CAT_COLORS  = { Cultural: '#A0720A', Natural: '#2E7D32', Mixed: '#1565C0' }

const CYPHER_EXAMPLES = [
  { label: 'Sites in a State',   q: "MATCH (s:Site)-[:LOCATED_IN]->(st:State {name: 'Maharashtra'})\nRETURN s.name, s.year" },
  { label: 'Natural Sites',      q: "MATCH (s:Site)-[:TYPE]->(c:Category {name: 'Natural'})\nRETURN s.name, s.description" },
  { label: 'Sites by Keyword',   q: "MATCH (s:Site)-[:HAS_KEYWORD]->(k:Keyword {name: 'temple'})\nRETURN s.name, s.state" },
  { label: 'Count by Category',  q: "MATCH (s:Site)-[:TYPE]->(c:Category)\nRETURN c.name, COUNT(s) AS count" },
  { label: 'Sites per State',    q: "MATCH (st:State)<-[:LOCATED_IN]-(s:Site)\nRETURN st.name, COUNT(s) AS total" },
]

function buildGraphData(mode) {
  const nodes = [], edges = [], seen = new Set()
  const addNode = (id, label, type) => { if (!seen.has(id)) { seen.add(id); nodes.push({ id, label, type }) } }
  const subset = mode === 'cultural' ? SITES_DATA.filter(s => s.category === 'Cultural')
               : mode === 'natural'  ? SITES_DATA.filter(s => s.category === 'Natural')
               : SITES_DATA.slice(0, mode === 'state' ? 32 : 28)

  subset.forEach(s => {
    const sid = `site_${s.id}`
    addNode(sid, s.name.length > 18 ? s.name.slice(0, 16) + '…' : s.name, 'site')
    if (mode !== 'state') {
      addNode(`cat_${s.category}`, s.category, 'category')
      edges.push({ source: sid, target: `cat_${s.category}`, label: 'TYPE' })
    }
    const stId = `st_${s.state}`
    addNode(stId, s.state.length > 14 ? s.state.slice(0, 12) + '…' : s.state, 'state')
    edges.push({ source: sid, target: stId, label: 'LOCATED_IN' })
    if (mode === 'all') {
      (s.keywords || []).slice(0, 2).forEach(kw => {
        const kid = `kw_${kw}`
        addNode(kid, kw, 'keyword')
        edges.push({ source: sid, target: kid, label: 'HAS_KEYWORD' })
      })
    }
  })
  return { nodes, edges }
}

export default function GraphPage() {
  const canvasRef = useRef()
  const [mode, setMode]               = useState('all')
  const [tooltip, setTooltip]         = useState(null)
  const [selectedCypher, setSelected] = useState(0)

  useEffect(() => { drawGraph(mode) }, [mode])

  function drawGraph(m) {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    canvas.width  = parent.clientWidth
    canvas.height = Math.max(500, parent.clientHeight)
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const cx = W / 2, cy = H / 2
    ctx.clearRect(0, 0, W, H)

    // Soft grid pattern
    ctx.strokeStyle = 'rgba(160,114,10,0.05)'
    ctx.lineWidth   = 1
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    const { nodes, edges } = buildGraphData(m)
    const nodeMap = {}

    nodes.forEach((n, i) => {
      let x, y
      if (n.type === 'category') {
        const catNodes = nodes.filter(x => x.type === 'category')
        const ci = catNodes.indexOf(n)
        const a  = (ci / catNodes.length) * Math.PI * 2 - Math.PI / 2
        x = cx + Math.cos(a) * 65; y = cy + Math.sin(a) * 65
      } else if (n.type === 'state') {
        const stNodes = nodes.filter(x => x.type === 'state')
        const si = stNodes.indexOf(n)
        const a  = (si / stNodes.length) * Math.PI * 2 - Math.PI / 2
        x = cx + Math.cos(a) * (m === 'state' ? 165 : 175)
        y = cy + Math.sin(a) * (m === 'state' ? 165 : 175)
      } else if (n.type === 'keyword') {
        const kwNodes = nodes.filter(x => x.type === 'keyword')
        const ki = kwNodes.indexOf(n)
        const a  = (ki / kwNodes.length) * Math.PI * 2
        x = cx + Math.cos(a) * 100; y = cy + Math.sin(a) * 100
      } else {
        const siteNodes = nodes.filter(x => x.type === 'site')
        const si = siteNodes.indexOf(n)
        const a  = (si / siteNodes.length) * Math.PI * 2
        const r  = 240 + Math.sin(si * 1.5) * 35
        x = cx + Math.cos(a) * r; y = cy + Math.sin(a) * r
      }
      n.x = x; n.y = y; nodeMap[n.id] = n
    })

    // Draw edges
    edges.forEach(e => {
      const f = nodeMap[e.source], t = nodeMap[e.target]
      if (!f || !t) return
      ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(t.x, t.y)
      ctx.strokeStyle = 'rgba(160,114,10,0.18)'; ctx.lineWidth = .8; ctx.stroke()
    })

    // Draw nodes
    nodes.forEach(n => {
      const r   = n.type === 'category' ? 24 : n.type === 'state' ? 18 : n.type === 'keyword' ? 12 : 13
      const col = NODE_COLORS[n.type]
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.fillStyle = col + '22'; ctx.fill()
      ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.stroke()
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      if (n.type !== 'site') {
        ctx.fillStyle = col; ctx.font = `${Math.max(9, r * .6)}px DM Sans, sans-serif`
        ctx.fillText(n.label, n.x, n.y)
      } else {
        ctx.fillStyle = '#5C3D1A'; ctx.font = '8px DM Sans, sans-serif'
        ctx.fillText(n.label, n.x, n.y + r + 9)
      }
    })

    // Hover
    canvas.onmousemove = e => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const hit = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < 20)
      setTooltip(hit ? { x: e.clientX, y: e.clientY, node: hit } : null)
    }
    canvas.onmouseleave = () => setTooltip(null)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ padding: '1.75rem 2rem' }}>

      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.85rem', fontWeight: 300, color: '#2C1A08', marginBottom: '.2rem' }}>
        Knowledge Graph
      </h2>
      <p style={{ fontSize: '.8rem', color: '#8B6A3A', marginBottom: '1.25rem' }}>
        Semantic relationships between sites, states, categories, and keywords
      </p>

      {/* Mode buttons */}
      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
        {[['all','All Nodes'],['cultural','Cultural'],['natural','Natural'],['state','By State']].map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '.35rem .9rem', borderRadius: '20px',
            border: `1px solid ${mode === m ? '#A0720A' : 'rgba(160,114,10,0.22)'}`,
            background: mode === m ? '#A0720A' : '#FFFFFF',
            color: mode === m ? '#FFFFFF' : '#5C3D1A',
            fontSize: '.75rem', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
          }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Canvas */}
        <div style={{
          flex: 1, background: '#FFFFFF',
          border: '1px solid rgba(160,114,10,0.15)',
          borderRadius: '16px', position: 'relative',
          overflow: 'hidden', minHeight: 520,
          boxShadow: '0 2px 12px rgba(160,114,10,0.07)',
        }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
        </div>

        {/* Legend + Cypher panel */}
        <div style={{ width: 230, flexShrink: 0 }}>

          {/* Legend */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.14)', borderRadius: '14px', padding: '1.1rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(160,114,10,0.05)' }}>
            <div style={{ fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B6A3A', marginBottom: '.75rem' }}>Node Types</div>
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.8rem', color: '#4A3520', marginBottom: '.4rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            ))}
            <div style={{ marginTop: '1rem', fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B6A3A', marginBottom: '.5rem' }}>Relationships</div>
            {['LOCATED_IN','TYPE','HAS_KEYWORD'].map(r => (
              <div key={r} style={{ fontSize: '.75rem', color: '#5C3D1A', opacity: .65, marginBottom: '.2rem' }}>→ {r}</div>
            ))}
          </div>

          {/* Cypher explorer */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.14)', borderRadius: '14px', padding: '1.1rem', boxShadow: '0 2px 8px rgba(160,114,10,0.05)' }}>
            <div style={{ fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B6A3A', marginBottom: '.75rem' }}>Sample Cypher Queries</div>
            {CYPHER_EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setSelected(i)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '.35rem .6rem', marginBottom: '.22rem',
                borderRadius: '6px', border: 'none',
                background: selectedCypher === i ? 'rgba(160,114,10,0.1)' : 'transparent',
                color: selectedCypher === i ? '#7A5608' : '#5C3D1A',
                fontSize: '.75rem', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: selectedCypher === i ? 500 : 400,
              }}>
                {ex.label}
              </button>
            ))}
            <div style={{
              marginTop: '.75rem', background: '#1E1E1E', borderRadius: '8px',
              padding: '.65rem', fontFamily: 'monospace',
              fontSize: '.68rem', color: '#9CDCFE',
              lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {CYPHER_EXAMPLES[selectedCypher].q}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 10,
          background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.25)',
          borderRadius: '8px', padding: '.55rem .85rem', zIndex: 200,
          pointerEvents: 'none', maxWidth: 180,
          boxShadow: '0 4px 16px rgba(160,114,10,0.14)',
        }}>
          <div style={{ fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', color: '#8B6A3A', marginBottom: '.15rem' }}>
            {tooltip.node.type}
          </div>
          <div style={{ fontSize: '.82rem', color: '#2C1A08', fontWeight: 500 }}>
            {tooltip.node.label}
          </div>
        </div>
      )}
    </motion.div>
  )
}
