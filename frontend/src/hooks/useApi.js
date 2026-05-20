import { useState, useEffect } from 'react'
import { SITES_DATA } from '../data/sites'

const BASE = '/api'

// Falls back to local data if API unavailable
async function apiFetch(path) {
  try {
    const res = await fetch(BASE + path)
    if (!res.ok) throw new Error(res.statusText)
    return await res.json()
  } catch {
    return null
  }
}

export function useSites() {
  const [sites, setSites] = useState(SITES_DATA)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiFetch('/search?limit=100').then(data => {
      if (data?.results?.length) setSites(data.results)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { sites, loading }
}

export function useSite(id) {
  const [site, setSite] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    // Try API first, fall back to local
    apiFetch(`/site/${id}`).then(data => {
      if (data && !data.detail) {
        setSite(data)
      } else {
        setSite(SITES_DATA.find(s => s.id === parseInt(id)) || null)
      }
      setLoading(false)
    }).catch(() => {
      setSite(SITES_DATA.find(s => s.id === parseInt(id)) || null)
      setLoading(false)
    })
  }, [id])

  return { site, loading }
}

export function useSearch(query, filters) {
  const [results, setResults] = useState(SITES_DATA)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query?.trim()
    // Local fallback search
    let local = [...SITES_DATA]
    if (q) {
      const ql = q.toLowerCase()
      local = local.filter(s =>
        `${s.name} ${s.state} ${s.category} ${(s.keywords||[]).join(' ')} ${s.description||''}`.toLowerCase().includes(ql)
      )
    }
    if (filters?.category?.length) local = local.filter(s => filters.category.includes(s.category))
    if (filters?.state?.length)    local = local.filter(s => filters.state.includes(s.state))
    setResults(local)
  }, [query, filters])

  return { results, loading }
}

export function useFilters() {
  const [filters, setFilters] = useState(null)

  useEffect(() => {
    const states = [...new Set(SITES_DATA.map(s => s.state))].sort()
    const cats   = [...new Set(SITES_DATA.map(s => s.category))].sort()
    const kws    = [...new Set(SITES_DATA.flatMap(s => s.keywords || []))].slice(0, 20)
    setFilters({ states, categories: cats, keywords: kws, year_range: { min: 1983, max: 2024 } })
    // Try to get from API
    apiFetch('/filters').then(data => { if (data) setFilters(data) }).catch(() => {})
  }, [])

  return filters
}

export async function nlpSearch(query) {
  const data = await apiFetch(`/nlp/parse?q=${encodeURIComponent(query)}`)
  if (data) return data
  // Local fallback
  const ql = query.toLowerCase()
  const results = SITES_DATA.filter(s =>
    `${s.name} ${s.state} ${s.category} ${(s.keywords||[]).join(' ')}`.toLowerCase().includes(ql)
  ).slice(0, 10)
  return { intent: 'general', results, count: results.length, explanation: `Searched for: ${query}` }
}

export async function sendChatMessage(message) {
  const data = await apiFetch('/chat')  // POST not implemented in hook, use axios in component
  return data
}
