import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import SiteCard from '../components/SiteCard'
import { SITES_DATA } from '../data/sites'

const FEATURED_IDS   = [4, 6, 9, 17, 27, 31, 35, 36]
const QUICK_SEARCHES = ['Natural sites', 'Temples', 'Maharashtra', 'Rajasthan forts', 'Ancient caves', 'Buddhist monuments']

export default function Home() {
  const [query, setQuery]         = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showAc, setShowAc]       = useState(false)
  const navigate = useNavigate()

  const featured = SITES_DATA.filter(s => FEATURED_IDS.includes(s.id))
  const stats = {
    total:    SITES_DATA.length,
    cultural: SITES_DATA.filter(s => s.category === 'Cultural').length,
    natural:  SITES_DATA.filter(s => s.category === 'Natural').length,
    mixed:    SITES_DATA.filter(s => s.category === 'Mixed').length,
  }

  const handleInput = (v) => {
    setQuery(v)
    if (!v) { setSuggestions([]); setShowAc(false); return }
    const matches = SITES_DATA.filter(s =>
      `${s.name} ${s.state} ${(s.keywords||[]).join(' ')}`.toLowerCase().includes(v.toLowerCase())
    ).slice(0, 6)
    setSuggestions(matches)
    setShowAc(true)
  }

  const doSearch = (q = query) => {
    setShowAc(false)
    navigate(`/browse?q=${encodeURIComponent(q)}`)
  }

  const CAT_COLORS = { Cultural: '#A0720A', Natural: '#2E7D32', Mixed: '#1565C0' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}>

      {/* ── HERO SECTION ──────────────────────────────────────────── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        minHeight: 520, display: 'flex', alignItems: 'center',
        background: 'linear-gradient(120deg, #FAF7F2 0%, #F5EDD6 50%, #EDE0C0 100%)',
      }}>
        {/* Right-side Taj Mahal image with mask */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%',
          backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg')",
          backgroundSize: 'cover', backgroundPosition: 'center',
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 18%, rgba(0,0,0,0.65) 45%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) 18%, rgba(0,0,0,0.65) 45%, black 100%)',
        }} />

        {/* Warm radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(160,114,10,0.07), transparent)', pointerEvents: 'none' }} />

        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 2, padding: '4rem 2.5rem', maxWidth: 640 }}>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              padding: '.28rem .9rem', borderRadius: '20px',
              background: 'rgba(160,114,10,0.1)', border: '1px solid rgba(160,114,10,0.22)',
              fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase',
              color: '#7A5608', marginBottom: '1.4rem',
            }}>
            🏛 UNESCO World Heritage · India
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.9rem)', fontWeight: 300,
              lineHeight: 1.12, color: '#2C1A08', marginBottom: '1rem',
            }}>
            Discover India's<br />
            <span style={{ color: '#7A5608', fontWeight: 600, fontStyle: 'italic' }}>Timeless Heritage</span><br />
            Through Knowledge
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}
            style={{ fontSize: '.95rem', color: '#5C3D1A', maxWidth: 430, lineHeight: 1.8, marginBottom: '2rem', opacity: .85 }}>
            An AI-powered semantic exploration system mapping connections between heritage sites, history, and geography.
          </motion.p>

          {/* Stats row — all numbers preserved */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4 }}
            style={{ display: 'flex', gap: '.85rem', marginBottom: '2.2rem', flexWrap: 'wrap' }}>
            {[
              { n: stats.total,    l: 'Heritage Sites', c: '#7A5608' },
              { n: stats.cultural, l: 'Cultural',       c: '#A0720A' },
              { n: stats.natural,  l: 'Natural',        c: '#2E7D32' },
              { n: stats.mixed,    l: 'Mixed',          c: '#1565C0' },
            ].map(({ n, l, c }) => (
              <div key={l} style={{
                textAlign: 'center', padding: '.6rem 1rem',
                background: '#FFFFFF', borderRadius: '12px',
                border: '1px solid rgba(160,114,10,0.18)',
                boxShadow: '0 2px 8px rgba(160,114,10,0.07)',
                minWidth: 70,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 600, color: c, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: '.62rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#8B6A3A', marginTop: '.22rem' }}>{l}</div>
              </div>
            ))}
          </motion.div>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }}
            style={{ position: 'relative', maxWidth: 530, marginBottom: '1.1rem' }}>
            <Search size={17} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#A0720A', opacity: .7 }} />
            <input
              value={query}
              onChange={e => handleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              onBlur={() => setTimeout(() => setShowAc(false), 160)}
              onFocus={() => suggestions.length && setShowAc(true)}
              placeholder="Search heritage sites, states, categories..."
              style={{
                width: '100%', padding: '.92rem 7.5rem .92rem 3rem',
                background: '#FFFFFF', border: '1.5px solid rgba(160,114,10,0.25)',
                borderRadius: '14px', fontFamily: "'DM Sans', sans-serif",
                fontSize: '.9rem', color: '#2C1A08', outline: 'none',
                boxShadow: '0 2px 14px rgba(160,114,10,0.09)',
                transition: 'border-color .25s, box-shadow .25s',
              }}
              onFocus={e => { e.target.style.borderColor='rgba(160,114,10,0.6)'; e.target.style.boxShadow='0 4px 20px rgba(160,114,10,0.14)' }}
              onBlur={e  => { e.target.style.borderColor='rgba(160,114,10,0.25)'; e.target.style.boxShadow='0 2px 14px rgba(160,114,10,0.09)' }}
            />
            <button onClick={() => doSearch()} style={{
              position: 'absolute', right: '.5rem', top: '50%', transform: 'translateY(-50%)',
              background: '#A0720A', color: '#FFFFFF', border: 'none',
              padding: '.5rem 1.1rem', borderRadius: '10px',
              fontFamily: "'DM Sans', sans-serif", fontSize: '.8rem', fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.3rem',
              transition: 'background .2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#7A5608'}
              onMouseLeave={e => e.currentTarget.style.background = '#A0720A'}
            >
              Search <ArrowRight size={13} />
            </button>

            {/* Autocomplete dropdown */}
            {showAc && suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
                background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.2)',
                borderRadius: '12px', overflow: 'hidden', zIndex: 50,
                boxShadow: '0 8px 24px rgba(160,114,10,0.13)',
              }}>
                {suggestions.map(s => (
                  <div key={s.id} onClick={() => doSearch(s.name)}
                    style={{ padding: '.6rem 1rem', fontSize: '.84rem', color: '#2C1A08', cursor: 'pointer', display: 'flex', gap: '.7rem', alignItems: 'center', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(160,114,10,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[s.category] || '#A0720A', flexShrink: 0 }} />
                    <span>{s.name}</span>
                    <span style={{ opacity: .4, fontSize: '.76rem' }}>· {s.state}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick search chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}
            style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
            {QUICK_SEARCHES.map(qs => (
              <button key={qs} onClick={() => doSearch(qs)} style={{
                padding: '.3rem .85rem', borderRadius: '20px',
                border: '1px solid rgba(160,114,10,0.22)', background: '#FFFFFF',
                color: '#5C3D1A', fontSize: '.74rem', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='#A0720A'; e.currentTarget.style.color='#FFFFFF'; e.currentTarget.style.borderColor='#A0720A' }}
                onMouseLeave={e => { e.currentTarget.style.background='#FFFFFF'; e.currentTarget.style.color='#5C3D1A'; e.currentTarget.style.borderColor='rgba(160,114,10,0.22)' }}
              >
                {qs}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── FEATURED SITES GRID ────────────────────────────────────── */}
      <div style={{ padding: '2.5rem 2rem', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{
          fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase',
          color: '#8B6A3A', marginBottom: '1.3rem',
          display: 'flex', alignItems: 'center', gap: '.75rem',
        }}>
          Featured Heritage Sites
          <div style={{ flex: 1, height: '1px', background: 'rgba(160,114,10,0.18)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {featured.map((site, i) => <SiteCard key={site.id} site={site} index={i} />)}
        </div>
      </div>

      {/* ── CATEGORY STRIPS ────────────────────────────────────────── */}
      <div style={{ background: '#F2EBE0', padding: '2.5rem 2rem', borderTop: '1px solid rgba(160,114,10,0.12)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{
            fontSize: '.65rem', letterSpacing: '.22em', textTransform: 'uppercase',
            color: '#8B6A3A', marginBottom: '1.3rem',
            display: 'flex', alignItems: 'center', gap: '.75rem',
          }}>
            Explore by Category
            <div style={{ flex: 1, height: '1px', background: 'rgba(160,114,10,0.18)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
            {[
              { cat: 'Cultural', count: stats.cultural, color: '#A0720A', bg: '#FFF8E1',
                desc: 'Temples, forts, monuments and architectural marvels',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg' },
              { cat: 'Natural',  count: stats.natural,  color: '#2E7D32', bg: '#E8F5E9',
                desc: 'National parks, wildlife sanctuaries and biodiversity hotspots',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/One_horned_rhino_at_kaziranga.jpg/800px-One_horned_rhino_at_kaziranga.jpg' },
              { cat: 'Mixed',    count: stats.mixed,    color: '#1565C0', bg: '#E3F2FD',
                desc: 'Sites with outstanding cultural and natural significance',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kangchenjunga.jpg/800px-Kangchenjunga.jpg' },
            ].map(({ cat, count, color, bg, desc, img }) => (
              <div key={cat} onClick={() => navigate(`/browse?q=${cat}`)}
                style={{
                  borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                  border: `1px solid ${color}22`,
                  boxShadow: '0 2px 10px rgba(160,114,10,0.07)',
                  transition: 'transform .25s, box-shadow .25s',
                  background: '#FFFFFF',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 28px ${color}22` }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(160,114,10,0.07)' }}
              >
                {/* Category card image */}
                <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                  <img src={img} alt={cat}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s' }}
                    onError={e => e.currentTarget.style.display='none'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${color}cc 0%, transparent 60%)` }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF' }}>{count}</div>
                    <div style={{ fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>Sites</div>
                  </div>
                </div>
                <div style={{ padding: '.9rem 1.1rem' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontWeight: 500, color, marginBottom: '.3rem' }}>{cat}</div>
                  <div style={{ fontSize: '.76rem', color: '#5C3D1A', lineHeight: 1.5, opacity: .8 }}>{desc}</div>
                  <div style={{ marginTop: '.65rem', fontSize: '.72rem', color, fontWeight: 500 }}>Explore {cat} sites →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
