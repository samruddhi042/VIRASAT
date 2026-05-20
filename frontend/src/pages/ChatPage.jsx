import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Database, GitBranch } from 'lucide-react'
import { SITES_DATA, STATS } from '../data/sites'
import { SITE_IMAGES } from '../data/siteImages'

const INDIA_STATES = [
  "andhra pradesh","assam","bihar","chandigarh","delhi","goa","gujarat",
  "himachal pradesh","karnataka","kerala","madhya pradesh","maharashtra",
  "multiple","odisha","punjab","rajasthan","sikkim","tamil nadu","telangana",
  "uttar pradesh","uttarakhand","west bengal",
]
const KW_MAP = {
  temple:'temple',temples:'temple',fort:'fort',forts:'fort',
  cave:'cave',caves:'cave',palace:'palace',mosque:'mosque',
  wildlife:'wildlife',park:'park',railway:'railway',
  buddhist:'Buddhist',mughal:'Mughal',rajput:'Rajput',
  prehistoric:'prehistoric',stupa:'stupa',monastery:'monastery',stepwell:'stepwell',
}
const CAT_COLORS = { Cultural:'#A0720A', Natural:'#2E7D32', Mixed:'#1565C0' }

const SUGGESTIONS = [
  "Sites in Maharashtra","Natural heritage sites","How many cultural sites?",
  "Show temples in India","Oldest UNESCO sites","Sites in Rajasthan",
  "Tell me about Taj Mahal","Recently inscribed sites","Wildlife sanctuaries","Mughal heritage sites",
]

function parseIntent(q) {
  const ql = q.toLowerCase()
  const intent = { type: 'general', state: null, category: null, keyword: null, site: null }
  if (/how many|count|total|number of/.test(ql)) intent.type = 'count'
  else if (/oldest|earliest|first/.test(ql)) intent.type = 'oldest'
  else if (/recent|latest|newest/.test(ql)) intent.type = 'recent'
  else {
    const sm = SITES_DATA.find(s => s.name.toLowerCase().split(' ').slice(0,2).some(w => w.length > 3 && ql.includes(w)))
    if (sm) { intent.type = 'detail'; intent.site = sm }
  }
  const stateMatch = INDIA_STATES.find(st => ql.includes(st))
  if (stateMatch) { intent.state = stateMatch.replace(/\b\w/g, c => c.toUpperCase()); if (intent.type === 'general') intent.type = 'filter' }
  const catMatch = ['cultural','natural','mixed'].find(c => ql.includes(c))
  if (catMatch) { intent.category = catMatch.charAt(0).toUpperCase() + catMatch.slice(1); if (intent.type === 'general') intent.type = 'filter' }
  const kwMatch = Object.keys(KW_MAP).find(k => ql.includes(k))
  if (kwMatch) { intent.keyword = KW_MAP[kwMatch]; if (intent.type === 'general') intent.type = 'filter' }
  return intent
}

function buildCypher(intent) {
  const { type, state, category, keyword, site } = intent
  if (type === 'detail' && site) return `MATCH (s:Site {name: "${site.name}"})-[r]->(n)\nRETURN s, r, n`
  if (type === 'count') {
    if (category) return `MATCH (s:Site)-[:TYPE]->(c:Category {name: "${category}"})\nRETURN COUNT(s) AS total`
    if (state)    return `MATCH (s:Site)-[:LOCATED_IN]->(st:State {name: "${state}"})\nRETURN COUNT(s) AS total`
    return `MATCH (s:Site) RETURN COUNT(s) AS total`
  }
  if (type === 'oldest') { let b = `MATCH (s:Site)`; if (state) b += `\nMATCH (s)-[:LOCATED_IN]->(st:State {name: "${state}"})`; return `${b}\nRETURN s.name, s.year\nORDER BY s.year ASC\nLIMIT 5` }
  if (type === 'recent') return `MATCH (s:Site)\nRETURN s.name, s.year\nORDER BY s.year DESC\nLIMIT 5`
  let parts = [`MATCH (s:Site)`]
  if (state)    parts.push(`MATCH (s)-[:LOCATED_IN]->(st:State {name: "${state}"})`)
  if (category) parts.push(`MATCH (s)-[:TYPE]->(c:Category {name: "${category}"})`)
  if (keyword)  parts.push(`MATCH (s)-[:HAS_KEYWORD]->(k:Keyword {name: "${keyword}"})`)
  parts.push(`RETURN s.name, s.year\nORDER BY s.year`)
  return parts.join('\n')
}

function localQuery(intent) {
  const { type, state, category, keyword, site } = intent
  if (type === 'detail' && site) return [site]
  let r = [...SITES_DATA]
  if (state)    r = r.filter(s => s.state.toLowerCase() === state.toLowerCase())
  if (category) r = r.filter(s => s.category === category)
  if (keyword)  r = r.filter(s => (s.keywords||[]).some(k => k.toLowerCase().includes(keyword.toLowerCase())))
  if (type === 'oldest') return [...r].sort((a,b) => a.year - b.year).slice(0,5)
  if (type === 'recent') return [...r].sort((a,b) => b.year - a.year).slice(0,5)
  if (type === 'count')  return [{ count: r.length }]
  return r.slice(0, 10)
}

function genAnswer(intent, results) {
  const { type, state, category, keyword, site } = intent
  if (type === 'detail' && site)
    return `<b>${site.name}</b> is a <b>${site.category}</b> UNESCO World Heritage Site in <b>${site.state}</b>, inscribed in <b>${site.year}</b>.<br/><br/>${(site.description||'').slice(0,280)}...`
  if (type === 'count') {
    const n = results[0]?.count ?? results.length
    return `India has <b>${n}</b> UNESCO World Heritage Sites${category ? ` of category <b>${category}</b>` : ''}${state ? ` in <b>${state}</b>` : ''}.`
  }
  if (type === 'oldest')
    return `The <b>oldest</b> inscribed UNESCO sites${state ? ` in ${state}` : ''} are:<br/><br/>` +
      results.map(s => `• <b>${s.name || s['s.name']}</b> — ${s.year || s['s.year']}`).join('<br/>')
  if (type === 'recent')
    return `The <b>most recently</b> inscribed UNESCO sites are:<br/><br/>` +
      results.map(s => `• <b>${s.name || s['s.name']}</b> — ${s.year || s['s.year']}`).join('<br/>')
  if (!results.length)
    return `No sites found. Try asking about a specific state, category (Cultural/Natural/Mixed), or keyword like "temple", "fort", or "wildlife".`
  let pre = `Found <b>${results.length}</b> site${results.length > 1 ? 's' : ''}`
  if (state)    pre += ` in <b>${state}</b>`
  if (category) pre += ` of category <b>${category}</b>`
  if (keyword)  pre += ` with keyword <b>${keyword}</b>`
  return pre + ':'
}

export default function ChatPage() {
  const [messages, setMessages] = useState([{
    role: 'ai', sites: [], cypher: null, fromNeo4j: false,
    text: `Namaste! 🙏 I'm <b>Virasat Chat</b>, powered by the <b>Neo4j Knowledge Graph</b>.<br/><br/>
I parse your natural language queries into <b>Cypher queries</b> and fetch results from the graph database. Ask me about India's <b>${STATS.total} UNESCO Heritage Sites</b>!`,
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [neo4jOk, setNeo4jOk] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    fetch('http://localhost:8000/api/stats', { signal: AbortSignal.timeout(3000) })
      .then(r => r.ok && setNeo4jOk(true)).catch(() => {})
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const send = async (text) => {
    const q = (text || input).trim()
    if (!q || loading) return
    setInput('')
    const intent = parseIntent(q)
    const cypher = buildCypher(intent)
    setMessages(prev => [...prev, { role: 'user', text: q, sites: [], cypher: null }])
    setLoading(true)
    let results, fromNeo4j = false
    try {
      const res = await fetch(`http://localhost:8000/api/nlp/parse?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(4000) })
      if (res.ok) { const d = await res.json(); results = d.results || []; fromNeo4j = true }
      else throw new Error()
    } catch { results = localQuery(intent) }
    const ansText = genAnswer(intent, results)
    const siteCards = results.filter(r => r.id || r.name)
      .map(r => SITES_DATA.find(s => s.name === (r.name || r['s.name'])) || r)
      .filter(r => r.emoji).slice(0, 6)
    setLoading(false)
    setMessages(prev => [...prev, { role: 'ai', text: ansText, sites: siteCards, cypher, fromNeo4j, intent: intent.type }])
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ maxWidth: 860, margin: '0 auto', padding: '1.75rem 2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.1rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.85rem', fontWeight: 300, color: '#2C1A08', marginBottom: '.2rem' }}>
            Knowledge Graph Chat
          </h2>
          <p style={{ fontSize: '.78rem', color: '#8B6A3A' }}>Rule-based NLP · Queries Neo4j graph database</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.28rem .8rem', borderRadius: '20px', background: neo4jOk ? 'rgba(46,125,50,0.1)' : 'rgba(160,114,10,0.08)', border: `1px solid ${neo4jOk ? 'rgba(46,125,50,0.35)' : 'rgba(160,114,10,0.25)'}`, fontSize: '.68rem', color: neo4jOk ? '#2E7D32' : '#A0720A' }}>
            <Database size={11} /> Neo4j: {neo4jOk ? 'Connected ✓' : 'Offline (local fallback)'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.28rem .8rem', borderRadius: '20px', background: 'rgba(21,101,192,0.08)', border: '1px solid rgba(21,101,192,0.22)', fontSize: '.68rem', color: '#1565C0' }}>
            <GitBranch size={11} /> Rule-based NLP
          </div>
        </div>
      </div>

      {/* Suggestion chips */}
      <div style={{ display: 'flex', gap: '.35rem', flexWrap: 'wrap', marginBottom: '.9rem' }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} disabled={loading} style={{
            padding: '.28rem .78rem', borderRadius: '20px',
            border: '1px solid rgba(160,114,10,0.22)', background: '#FFFFFF',
            color: '#5C3D1A', fontSize: '.72rem', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans',sans-serif", opacity: loading ? .5 : 1, transition: 'all .2s',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#A0720A'; e.currentTarget.style.color = '#FFFFFF' }}}
          onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#5C3D1A' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.14)',
        borderRadius: '16px', padding: '1.1rem',
        minHeight: 320, maxHeight: 500, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: '.9rem',
        marginBottom: '.9rem', boxShadow: '0 2px 8px rgba(160,114,10,0.05)',
      }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: '.65rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'ai' ? 'rgba(160,114,10,0.12)' : 'rgba(21,101,192,0.1)',
                border: msg.role === 'ai' ? '1px solid rgba(160,114,10,0.3)' : '1px solid rgba(21,101,192,0.3)',
                color: msg.role === 'ai' ? '#A0720A' : '#1565C0',
              }}>
                {msg.role === 'ai' ? <Sparkles size={14} /> : 'U'}
              </div>
              <div style={{ maxWidth: '80%' }}>
                {/* Bubble */}
                <div style={{
                  padding: '.72rem .95rem', borderRadius: '13px',
                  background: msg.role === 'ai' ? '#FAF7F2' : 'rgba(21,101,192,0.07)',
                  border: msg.role === 'ai' ? '1px solid rgba(160,114,10,0.12)' : '1px solid rgba(21,101,192,0.2)',
                  fontSize: '.84rem', lineHeight: 1.75,
                  color: msg.role === 'ai' ? '#4A3520' : '#1A3A6A',
                }} dangerouslySetInnerHTML={{ __html: msg.text }} />

                {/* Cypher query shown */}
                {msg.cypher && msg.role === 'ai' && (
                  <div style={{ marginTop: '.5rem', background: '#1E1E1E', borderRadius: '10px', padding: '.65rem .85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', marginBottom: '.35rem' }}>
                      <Database size={10} style={{ color: '#569CD6' }} />
                      <span style={{ fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#569CD6', opacity: .8 }}>
                        {msg.fromNeo4j ? 'Neo4j Live Query' : 'Cypher (local fallback)'}
                      </span>
                      {msg.fromNeo4j && <span style={{ fontSize: '.6rem', padding: '.1rem .4rem', background: 'rgba(46,125,50,0.2)', border: '1px solid rgba(46,125,50,0.4)', borderRadius: '20px', color: '#4CAF50' }}>● Live</span>}
                    </div>
                    <pre style={{ fontFamily: 'Courier New, monospace', fontSize: '.7rem', color: '#9CDCFE', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {msg.cypher}
                    </pre>
                  </div>
                )}

                {/* Site result cards with images */}
                {msg.sites?.length > 0 && (
                  <div style={{ marginTop: '.5rem', display: 'flex', flexDirection: 'column', gap: '.32rem' }}>
                    {msg.sites.map(s => <ChatSiteCard key={s.id} site={s} />)}
                  </div>
                )}

                {msg.role === 'ai' && msg.intent && (
                  <div style={{ marginTop: '.3rem', fontSize: '.62rem', color: '#8B6A3A', opacity: .55 }}>
                    Intent: <b>{msg.intent}</b>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '.65rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(160,114,10,0.1)', border: '1px solid rgba(160,114,10,0.25)' }}>
              <Database size={13} style={{ color: '#A0720A' }} />
            </div>
            <div style={{ padding: '.55rem .9rem', background: '#FAF7F2', border: '1px solid rgba(160,114,10,0.12)', borderRadius: '13px', display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ fontSize: '.73rem', color: '#8B6A3A', marginRight: 6 }}>Querying graph</span>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#A0720A', opacity: .5, animation: `bounce 1.2s ${i*0.2}s infinite` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: '.65rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
          placeholder="Ask about sites, states, categories, keywords..."
          style={{
            flex: 1, padding: '.82rem 1rem',
            background: '#FFFFFF', border: '1.5px solid rgba(160,114,10,0.2)',
            borderRadius: '13px', color: '#2C1A08',
            fontFamily: "'DM Sans',sans-serif", fontSize: '.88rem', outline: 'none',
            opacity: loading ? .7 : 1,
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(160,114,10,0.55)'}
          onBlur={e => e.target.style.borderColor = 'rgba(160,114,10,0.2)'}
        />
        <button onClick={() => send()} disabled={loading} style={{
          background: loading ? 'rgba(160,114,10,0.35)' : '#A0720A', color: '#FFFFFF',
          border: 'none', padding: '0 1.3rem', borderRadius: '13px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '.4rem',
          fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: '.85rem',
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#7A5608' }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#A0720A' }}>
          <Send size={15} /> Send
        </button>
      </div>

      {/* Pipeline indicator */}
      <div style={{ marginTop: '.75rem', display: 'flex', gap: '.6rem', fontSize: '.68rem', color: '#8B6A3A', opacity: .55, flexWrap: 'wrap' }}>
        <span>① NLP parses intent</span><span>→</span>
        <span>② Cypher generated</span><span>→</span>
        <span>③ Neo4j returns results</span><span>→</span>
        <span>④ Answer displayed</span>
      </div>

      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}`}</style>
    </motion.div>
  )
}

function ChatSiteCard({ site }) {
  const color  = CAT_COLORS[site.category] || '#A0720A'
  const imgUrl = SITE_IMAGES[site.id]
  return (
    <div onClick={() => window.location.href = `/site/${site.id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '.75rem',
        padding: '.0', borderRadius: '10px', overflow: 'hidden',
        background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.14)',
        cursor: 'pointer', transition: 'all .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(160,114,10,0.4)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(160,114,10,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(160,114,10,0.14)'; e.currentTarget.style.boxShadow = 'none' }}>

      {/* Thumbnail image */}
      <div style={{ width: 64, height: 52, flexShrink: 0, overflow: 'hidden', position: 'relative', background: '#F5EDD6' }}>
        {imgUrl ? (
          <img src={imgUrl} alt={site.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div style={{ display: imgUrl ? 'none' : 'flex', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
          {site.emoji}
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, padding: '.45rem .7rem .45rem 0' }}>
        <div style={{ fontSize: '.82rem', color: '#2C1A08', fontFamily: "'Cormorant Garamond',serif" }}>{site.name}</div>
        <div style={{ fontSize: '.7rem', color: '#8B6A3A', marginTop: '.1rem' }}>{site.state} · {site.year}</div>
      </div>

      {/* Category badge */}
      <div style={{
        fontSize: '.6rem', padding: '.14rem .5rem', borderRadius: '20px', flexShrink: 0,
        marginRight: '.6rem',
        background: `${color}12`, color, border: `1px solid ${color}35`,
      }}>
        {site.category}
      </div>
    </div>
  )
}
