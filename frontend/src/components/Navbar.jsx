import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Network, MessageCircle, Search, Home } from 'lucide-react'

const LINKS = [
  { to: '/',       label: 'Explore',   icon: Home },
  { to: '/browse', label: 'Sites',     icon: Search },
  { to: '/graph',  label: 'Graph',     icon: Network },
  { to: '/chat',   label: 'Ask AI',    icon: MessageCircle },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '1px solid rgba(160,114,10,0.18)',
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(250,247,242,0.96)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 2px 12px rgba(160,114,10,0.07)',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.5rem', fontWeight: 600,
          color: '#7A5608', lineHeight: 1.1,
        }}>
          Virasat
          <span style={{
            display: 'block', fontFamily: "'DM Sans', sans-serif",
            fontSize: '.65rem', fontWeight: 300,
            letterSpacing: '.18em', color: '#8B6A3A',
            fontStyle: 'italic', opacity: .8,
          }}>
            UNESCO Heritage India
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '.25rem' }}>
        {LINKS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to))
          return (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: .97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.4rem',
                  padding: '.45rem 1rem',
                  background: active ? '#A0720A' : 'transparent',
                  border: active ? '1px solid #A0720A' : '1px solid transparent',
                  borderRadius: '8px',
                  color: active ? '#FFFFFF' : '#5C3D1A',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '.78rem', letterSpacing: '.07em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(160,114,10,0.08)'; e.currentTarget.style.color = '#7A5608' }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5C3D1A' }}}
              >
                <Icon size={14} />
                {label}
              </motion.button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
