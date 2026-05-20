import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Network } from 'lucide-react'
import { SITES_DATA } from '../data/sites'
import { SITE_IMAGES } from '../data/siteImages'

const CAT_COLORS = { Cultural: '#A0720A', Natural: '#2E7D32', Mixed: '#1565C0' }

export default function SiteDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const site     = SITES_DATA.find(s => s.id === parseInt(id))

  if (!site) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#5C3D1A' }}>
      Site not found.{' '}
      <button onClick={() => navigate('/browse')}
        style={{ color: '#A0720A', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back
      </button>
    </div>
  )

  const color   = CAT_COLORS[site.category] || '#A0720A'
  const imgUrl  = SITE_IMAGES[site.id]
  const related = SITES_DATA
    .filter(s => s.id !== site.id && (s.state === site.state || s.category === site.category))
    .slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .4 }}
    >
      {/* ── Full-bleed hero image ──────────────────────────────────── */}
      <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>

        {/* Hero image */}
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={site.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              display: 'block',
            }}
            onError={e => {
              e.currentTarget.style.display = 'none'
              document.getElementById('hero-emoji-fb').style.display = 'flex'
            }}
          />
        ) : null}

        {/* Emoji fallback */}
        <div id="hero-emoji-fb" style={{
          display: imgUrl ? 'none' : 'flex',
          position: 'absolute', inset: 0,
          alignItems: 'center', justifyContent: 'center',
          fontSize: '7rem',
          background: 'linear-gradient(135deg, #F5EDD6, #E8DDD0)',
        }}>
          {site.emoji}
        </div>

        {/* Gradient overlay — text stays readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(20,10,0,0.82) 0%, rgba(20,10,0,0.3) 55%, transparent 100%)',
        }} />

        {/* Back button — top left */}
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: '1.5rem', left: '2rem',
          display: 'inline-flex', alignItems: 'center', gap: '.4rem',
          color: 'rgba(255,255,255,0.88)', fontSize: '.78rem',
          background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px', padding: '.3rem .85rem',
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          transition: 'background .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.28)'}
        >
          <ArrowLeft size={13} /> Back to Sites
        </button>

        {/* Hero text content — bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '2rem 2.5rem',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* Category badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.4rem',
              padding: '.22rem .78rem', borderRadius: '20px',
              background: `${color}cc`, color: '#FFFFFF',
              fontSize: '.65rem', letterSpacing: '.15em',
              textTransform: 'uppercase', fontWeight: 600, marginBottom: '.75rem',
            }}>
              {site.category}
            </div>

            {/* Site title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 300, color: '#FFFFFF',
              lineHeight: 1.15, marginBottom: '.55rem',
              textShadow: '0 2px 16px rgba(0,0,0,0.45)',
            }}>
              {site.name}
            </h1>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '.82rem', color: 'rgba(255,255,255,0.78)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <MapPin size={12} /> {site.state}, India
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                <Calendar size={12} /> UNESCO Inscribed {site.year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body content ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr',
        gap: '2rem', padding: '2.5rem',
        maxWidth: 1200, margin: '0 auto',
      }}>

        {/* LEFT column */}
        <div>
          <SectionLabel>About</SectionLabel>
          <p style={{
            fontSize: '.92rem', lineHeight: 1.9,
            color: '#4A3520', marginBottom: '1.5rem',
          }}>
            {site.description}
          </p>

          {/* NLP Entities card */}
          <InfoCard title="NLP Extracted Entities">
            <EntityGroup label="📍 Locations"    items={site.entities?.locations || []}  cls="loc" />
            <EntityGroup label="🏷️ Keywords"     items={site.entities?.keywords  || []}  cls="kw"  />
            <EntityGroup label="📜 Historical"   items={site.entities?.historical || []} cls="hist" />
            {site.entities?.persons?.length > 0 &&
              <EntityGroup label="👤 Persons" items={site.entities.persons} cls="person" />}
          </InfoCard>

          {/* Related sites */}
          {related.length > 0 && (
            <>
              <SectionLabel style={{ marginTop: '2rem' }}>Related Sites</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '.85rem' }}>
                {related.map(r => <RelatedCard key={r.id} site={r} onClick={() => navigate(`/site/${r.id}`)} />)}
              </div>
            </>
          )}
        </div>

        {/* RIGHT column */}
        <div>
          <InfoCard title="Site Information">
            {[
              ['Category', <span style={{ color }}>{site.category}</span>],
              ['State',    site.state],
              ['Country',  'India'],
              ['Inscribed', site.year],
              ['Keywords',  (site.keywords || []).join(', ')],
            ].map(([l, v]) => (
              <div key={l} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '.42rem 0',
                borderBottom: '1px solid rgba(160,114,10,0.08)',
                fontSize: '.83rem',
              }}>
                <span style={{ color: '#8B6A3A' }}>{l}</span>
                <span style={{ color: '#2C1A08', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </InfoCard>

          <InfoCard title="Timeline" style={{ marginTop: '1rem' }}>
            <div style={{ position: 'relative', paddingLeft: '1.4rem' }}>
              <div style={{
                position: 'absolute', left: '.38rem', top: 4, bottom: 4,
                width: '1.5px', background: 'rgba(160,114,10,0.2)',
              }} />
              {(site.entities?.historical || []).map((h, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '.65rem', fontSize: '.8rem' }}>
                  <div style={{
                    position: 'absolute', left: '-1.1rem', top: 5,
                    width: 8, height: 8, borderRadius: '50%',
                    border: '1.5px solid #A0720A', background: '#FAF7F2',
                  }} />
                  <div style={{ color: '#5C3D1A', lineHeight: 1.5 }}>{h}</div>
                </div>
              ))}
              <div style={{ position: 'relative', fontSize: '.8rem' }}>
                <div style={{
                  position: 'absolute', left: '-1.1rem', top: 5,
                  width: 8, height: 8, borderRadius: '50%', background: '#A0720A',
                }} />
                <div style={{ color: '#A0720A', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: '.95rem' }}>
                  {site.year}
                </div>
                <div style={{ color: '#8B6A3A', fontSize: '.75rem' }}>UNESCO Inscription</div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Knowledge Graph Query" style={{ marginTop: '1rem' }}>
            <div style={{
              background: '#1E1E1E', borderRadius: '8px',
              padding: '.75rem', fontFamily: 'monospace',
              fontSize: '.72rem', color: '#9CDCFE',
              lineHeight: 1.65, whiteSpace: 'pre-wrap',
            }}>
              {`MATCH (s:Site {name: "${site.name}"})\n-[r]->(n)\nRETURN s, r, n`}
            </div>
            <button onClick={() => navigate('/graph')} style={{
              marginTop: '.6rem', padding: '.35rem .85rem',
              borderRadius: '20px', border: '1px solid rgba(160,114,10,0.25)',
              background: 'transparent', color: '#A0720A',
              fontSize: '.72rem', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'inline-flex', alignItems: 'center', gap: '.3rem',
            }}>
              <Network size={12} /> View in Graph
            </button>
          </InfoCard>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: '.63rem', letterSpacing: '.2em', textTransform: 'uppercase',
      color: '#8B6A3A', marginBottom: '.75rem',
      display: 'flex', alignItems: 'center', gap: '.6rem', ...style,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'rgba(160,114,10,0.15)' }} />
    </div>
  )
}

function InfoCard({ title, children, style }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.14)',
      borderRadius: '16px', padding: '1.25rem',
      boxShadow: '0 2px 8px rgba(160,114,10,0.06)', ...style,
    }}>
      <SectionLabel>{title}</SectionLabel>
      {children}
    </div>
  )
}

const ENT_STYLES = {
  loc:    { background: '#E8F5E9', color: '#1B5E20', border: '1px solid #A5D6A7' },
  kw:     { background: '#FFF8E1', color: '#7B5E00', border: '1px solid #FFE082' },
  hist:   { background: '#E3F2FD', color: '#0D47A1', border: '1px solid #90CAF9' },
  person: { background: '#FCE4EC', color: '#880E4F', border: '1px solid #F48FB1' },
}

function EntityGroup({ label, items, cls }) {
  if (!items?.length) return null
  return (
    <div style={{ marginBottom: '.85rem' }}>
      <div style={{ fontSize: '.65rem', color: '#8B6A3A', opacity: .65, marginBottom: '.38rem' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem' }}>
        {items.map(e => (
          <span key={e} style={{
            padding: '.22rem .62rem', borderRadius: '8px',
            fontSize: '.72rem', ...ENT_STYLES[cls],
          }}>
            {e}
          </span>
        ))}
      </div>
    </div>
  )
}

function RelatedCard({ site, onClick }) {
  const imgUrl = SITE_IMAGES[site.id]
  const color  = CAT_COLORS[site.category] || '#A0720A'
  return (
    <div onClick={onClick} style={{
      background: '#FFFFFF', border: '1px solid rgba(160,114,10,0.14)',
      borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(160,114,10,0.06)',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(160,114,10,0.14)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(160,114,10,0.06)' }}
    >
      {/* Thumbnail */}
      <div style={{ height: 90, overflow: 'hidden', position: 'relative', background: '#F5EDD6' }}>
        {imgUrl ? (
          <img src={imgUrl} alt={site.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
            {site.emoji}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,10,0,0.4) 0%, transparent 60%)' }} />
        <div style={{
          position: 'absolute', bottom: 6, left: 8,
          fontSize: '.6rem', padding: '.12rem .4rem', borderRadius: '6px',
          background: 'rgba(255,255,255,0.9)', color, fontWeight: 600,
        }}>
          {site.year}
        </div>
      </div>
      {/* Text */}
      <div style={{ padding: '.6rem .75rem' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '.95rem', color: '#2C1A08', lineHeight: 1.3 }}>
          {site.name}
        </div>
        <div style={{ fontSize: '.7rem', color: '#8B6A3A', marginTop: '.18rem' }}>{site.state}</div>
      </div>
    </div>
  )
}
