import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar } from 'lucide-react'
import { SITE_IMAGES } from '../data/siteImages'

const CAT_COLORS = { Cultural: '#A0720A', Natural: '#2E7D32', Mixed: '#1565C0' }

export default function SiteCard({ site, index = 0 }) {
  const navigate = useNavigate()
  const color    = CAT_COLORS[site.category] || '#A0720A'
  const imgUrl   = SITE_IMAGES[site.id]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: .2 } }}
      onClick={() => navigate(`/site/${site.id}`)}
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(160,114,10,0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(160,114,10,0.07)',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
      onHoverStart={e => {}}
    >
      {/* ── Real image area ────────────────────────────────────── */}
      <div style={{
        height: 165,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F5EDD6, #E8DDD0)',
      }}>
        {imgUrl && (
          <img
            src={imgUrl}
            alt={site.name}
            loading="lazy"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onError={e => {
              e.currentTarget.style.display = 'none'
              const fb = e.currentTarget.parentElement.querySelector('.emoji-fallback')
              if (fb) fb.style.display = 'flex'
            }}
          />
        )}

        {/* Emoji fallback — only shows if image fails or no URL */}
        <div
          className="emoji-fallback"
          style={{
            display: imgUrl ? 'none' : 'flex',
            position: 'absolute', inset: 0,
            alignItems: 'center', justifyContent: 'center',
            fontSize: '4rem',
            background: 'linear-gradient(135deg, #F5EDD6, #E8DDD0)',
          }}
        >
          {site.emoji || '🏛️'}
        </div>

        {/* Gradient overlay — makes badges readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(30,15,0,0.55) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Category badge — top right */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          padding: '.2rem .6rem', borderRadius: '20px',
          background: 'rgba(255,255,255,0.93)',
          border: `1px solid ${color}44`,
          color, fontSize: '.6rem',
          letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          {site.category}
        </div>

        {/* Year badge — bottom left on image */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: '8px', padding: '.14rem .52rem',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '.85rem', fontWeight: 600, color: '#7A5608',
        }}>
          {site.year}
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────────── */}
      <div style={{ padding: '1rem 1.1rem' }}>

        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.13rem', fontWeight: 400,
          color: '#2C1A08', lineHeight: 1.3, marginBottom: '.35rem',
        }}>
          {site.name}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '.3rem',
          fontSize: '.74rem', color: '#8B6A3A', marginBottom: '.7rem',
        }}>
          <MapPin size={10} />
          {site.state}
        </div>

        <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap', marginBottom: '.7rem' }}>
          {(site.keywords || []).slice(0, 3).map(kw => (
            <span key={kw} style={{
              fontSize: '.62rem', padding: '.15rem .48rem',
              background: 'rgba(160,114,10,0.08)',
              border: '1px solid rgba(160,114,10,0.18)',
              borderRadius: '10px', color: '#7A5608',
            }}>
              {kw}
            </span>
          ))}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '.65rem', borderTop: '1px solid rgba(160,114,10,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', fontSize: '.78rem', color }}>
            <Calendar size={11} />
            {site.year}
          </div>
          <div style={{ fontSize: '.7rem', color: '#8B6A3A', opacity: .7 }}>View →</div>
        </div>
      </div>
    </motion.div>
  )
}
