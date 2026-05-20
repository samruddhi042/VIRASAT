import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import SiteCard from '../components/SiteCard'
import { SITES_DATA } from '../data/sites'

const ALL_STATES   = [...new Set(SITES_DATA.map(s => s.state))].sort()
const ALL_KEYWORDS = [...new Set(SITES_DATA.flatMap(s => s.keywords || []))].slice(0, 18)

export default function Browse() {
  const [searchParams] = useSearchParams()
  const [query,    setQuery]    = useState(searchParams.get('q') || '')
  const [selCats,  setSelCats]  = useState(['Cultural', 'Natural', 'Mixed'])
  const [selStates,setSelStates]= useState([])
  const [selKws,   setSelKws]   = useState([])
  const [sort,     setSort]     = useState('year')

  const filtered = SITES_DATA.filter(s => {
    if (!selCats.includes(s.category)) return false
    if (selStates.length && !selStates.includes(s.state)) return false
    if (selKws.length && !selKws.some(k => (s.keywords || []).includes(k))) return false
    if (query) {
      const ql = query.toLowerCase()
      if (!`${s.name} ${s.state} ${s.category} ${(s.keywords||[]).join(' ')} ${s.description||''}`.toLowerCase().includes(ql)) return false
    }
    return true
  }).sort((a, b) => {
    if (sort === 'year')  return a.year - b.year
    if (sort === 'name')  return a.name.localeCompare(b.name)
    if (sort === 'state') return a.state.localeCompare(b.state)
    return 0
  })

  const CAT_DOT = { Cultural: '#A0720A', Natural: '#2E7D32', Mixed: '#1565C0' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.75rem 2rem', maxWidth: 1400, margin: '0 auto' }}>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <div style={{ width: 218, flexShrink: 0 }}>

          {/* Category */}
          <FilterSection title="Category">
            {['Cultural', 'Natural', 'Mixed'].map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.28rem 0', cursor: 'pointer', fontSize: '.8rem', color: '#4A3520' }}>
                <input type="checkbox" checked={selCats.includes(c)}
                  onChange={() => setSelCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])}
                  style={{ accentColor: CAT_DOT[c], width: 14, height: 14 }}
                />
                <span style={{ color: selCats.includes(c) ? CAT_DOT[c] : '#4A3520', fontWeight: selCats.includes(c) ? 500 : 400 }}>{c}</span>
              </label>
            ))}
          </FilterSection>

          {/* State */}
          <FilterSection title="State">
            <div style={{ maxHeight: 230, overflowY: 'auto', paddingRight: '.25rem' }}>
              {ALL_STATES.map(st => (
                <label key={st} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.22rem 0', cursor: 'pointer', fontSize: '.76rem', color: '#4A3520' }}>
                  <input type="checkbox" checked={selStates.includes(st)}
                    onChange={() => setSelStates(p => p.includes(st) ? p.filter(x => x !== st) : [...p, st])}
                    style={{ accentColor: '#A0720A', width: 13, height: 13 }}
                  />
                  {st}
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Keywords */}
          <FilterSection title="Keywords">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.22rem' }}>
              {ALL_KEYWORDS.map(kw => (
                <button key={kw} onClick={() => setSelKws(p => p.includes(kw) ? p.filter(x => x !== kw) : [...p, kw])}
                  style={{
                    padding: '.25rem .65rem', borderRadius: '20px',
                    border: `1px solid ${selKws.includes(kw) ? '#A0720A' : 'rgba(160,114,10,0.22)'}`,
                    background: selKws.includes(kw) ? '#A0720A' : '#FFFFFF',
                    color: selKws.includes(kw) ? '#FFFFFF' : '#5C3D1A',
                    fontSize: '.7rem', cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", transition: 'all .18s',
                  }}>
                  {kw}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Reset */}
          {(selStates.length > 0 || selKws.length > 0 || query) && (
            <button onClick={() => { setQuery(''); setSelStates([]); setSelKws([]); setSelCats(['Cultural','Natural','Mixed']) }}
              style={{
                width: '100%', padding: '.45rem', borderRadius: '10px',
                border: '1px solid rgba(160,114,10,0.2)', background: '#FAF7F2',
                color: '#A0720A', fontSize: '.75rem', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}>
              Clear all filters
            </button>
          )}
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '1.1rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A0720A', opacity: .65 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, location, keywords..."
              style={{
                width: '100%', padding: '.82rem 1rem .82rem 2.85rem',
                background: '#FFFFFF', border: '1.5px solid rgba(160,114,10,0.2)',
                borderRadius: '12px', fontFamily: "'DM Sans', sans-serif",
                fontSize: '.88rem', color: '#2C1A08', outline: 'none',
                boxShadow: '0 2px 8px rgba(160,114,10,0.06)',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(160,114,10,0.55)'}
              onBlur={e => e.target.style.borderColor = 'rgba(160,114,10,0.2)'}
            />
          </div>

          {/* Results header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '.78rem', color: '#8B6A3A' }}>
              Showing <strong style={{ color: '#2C1A08' }}>{filtered.length}</strong> of {SITES_DATA.length} sites
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.2)',
              color: '#4A3520', padding: '.35rem .75rem', borderRadius: '8px',
              fontSize: '.75rem', fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer', outline: 'none',
            }}>
              <option value="year">By Year</option>
              <option value="name">Alphabetical</option>
              <option value="state">By State</option>
            </select>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#8B6A3A', opacity: .5 }}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔍</div>
              <div>No sites match your filters</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.1rem' }}>
              {filtered.map((site, i) => <SiteCard key={site.id} site={site} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        fontSize: '.62rem', letterSpacing: '.2em', textTransform: 'uppercase',
        color: '#8B6A3A', marginBottom: '.65rem',
        paddingBottom: '.4rem', borderBottom: '1px solid rgba(160,114,10,0.14)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}
