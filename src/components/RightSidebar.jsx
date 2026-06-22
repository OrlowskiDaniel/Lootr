import { useState } from 'react'    
import { Search, TrendingUp, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getTrendingTags, searchTags } from '../api/tags'
import { getPopularUsers } from '../api/follows'

export default function RightSidebar() {
  const [search, setSearch] = useState('')
  const [trending, setTrending] = useState([])
  const [results, setResults] = useState([])
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState([])

  // Fetch trending
  useEffect(() => {
    const load = async () => {
      const data = await getTrendingTags()
      setTrending(data)
    }
    load()
  }, [])

  // Search logic
  useEffect(() => {
    const run = async () => {
      if (!search) {
        setResults([])
        return
      }

      const data = await searchTags(search)
      setResults(data)
    }

    run()
  }, [search])

  // Featch populair users
  useEffect(() => {
    const loadSuggestions = async () => {
      const data = await getPopularUsers()
      setSuggestions(data)
    }

    loadSuggestions()
  }, [])

  return (
    /* CHANGED: Kept sticky top-0 so it fixes in place naturally with the window scroll */
    <aside className="w-full flex-shrink-0 flex flex-col gap-8 sticky top-0 !py-6 !px-4 z-20">

      {/* Search */}
      <div className="relative">
        {!search && (
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Lootr..."
          className="lootr-input w-full !pl-12 !pr-5 !py-4 rounded-full text-base"
        />
      </div>

      {/* Trending Box */}
      <div className="lootr-card rounded-xl overflow-visible">
        <div className="flex items-center gap-2 !px-5 !py-4 border-b"
          style={{ borderColor: 'var(--border)' }}>
          <TrendingUp size={18} style={{ color: 'var(--light-purple)' }} />
          <h3 className="font-heading font-bold text-base" style={{ color: 'var(--white)' }}>
            Trending in Gaming
          </h3>
        </div>

        {(search ? results : trending).map((item, i) => (
          <div
            key={item.name}
            onClick={() => navigate(`/?tag=${item.name}`)}
            className="flex items-center justify-between !px-5 !py-4 cursor-pointer border-b border-[var(--border)]"
          >
            <div>
              <p className="text-xs opacity-80">
                #{i + 1} · {item.category || 'Gaming'}
              </p>

              <p className="font-semibold text-sm">
                #{item.display_name || item.name}
              </p>

              {!search && (
                <p className="text-xs">
                  {item.count} posts
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="!px-5 !py-4">
        </div>
      </div>

      {/* Who to Follow Box */}
      <div className="lootr-card rounded-xl overflow-visible">
        <div className="!px-5 !py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-heading font-bold text-base" style={{ color: 'var(--white)' }}>
            Players to Follow
          </h3>
        </div>

        {suggestions.map((person, i) => (
          <div key={person.user_id}
            className="flex items-center gap-4 !px-5 !py-4 cursor-pointer transition-colors"
            style={{ borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Avatar */}
            <div className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 select-none overflow-hidden"
              style={{ background: person.avatar_url ? 'var(--dark-purple)' : `hsl(${i * 80 + 260}, 60%, 25%)` }}>
              {person.avatar_url ? (
                <img
                  src={person.avatar_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="font-heading font-bold text-sm" style={{ color: 'var(--light-purple)' }}>
                  {person.username?.[0]?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center !gap-1">
                <p className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--white)' }}>
                  {person.username}
                </p>
                {person.verified && (
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'var(--purple)' }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {person.followers.toLocaleString()} followers
              </p>
            </div>

            {/* Follow btn */}
            <button className="btn-ghost !px-4 !py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform active:scale-95">
              Follow
            </button>
          </div>
        ))}

        <div className="!px-5 !py-4">
        </div>
      </div>

      {/* Footer links */}
      <div className="!px-3 !pb-6">
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span className="inline-flex flex-wrap gap-x-2">
            {['Terms', 'Privacy', 'Cookies', 'About', '© 2025 LOOTR'].map(link => (
              <a key={link} href="#" className="hover:underline transition-colors"
                style={{ color: 'inherit' }}>{link}</a>
            ))}
          </span>
        </p>
      </div>
    </aside>
  )
}