import { useState } from 'react'    
import { Search, TrendingUp, Zap } from 'lucide-react'

const TRENDING = [
  { tag: 'Valorant', posts: '42.1K', category: 'Esports' },
  { tag: 'EldenRing', posts: '28.7K', category: 'RPG' },
  { tag: 'Minecraft', posts: '21.4K', category: 'Sandbox' },
  { tag: 'CallOfDuty', posts: '19.2K', category: 'FPS' },
  { tag: 'LeagueOfLegends', posts: '17.8K', category: 'MOBA' },
  { tag: 'Fortnite', posts: '15.3K', category: 'Battle Royale' },
]

const SUGGESTIONS = [
  { username: 'NinjaStream', display_name: 'Ninja', followers: '24.2M', verified: true },
  { username: 'ShroudFPS', display_name: 'Shroud', followers: '12.1M', verified: true },
  { username: 'Pokimane', display_name: 'Pokimane', followers: '9.4M', verified: true },
  { username: 'xQcOW', display_name: 'xQc', followers: '11.8M', verified: false },
]

export default function RightSidebar() {
  const [search, setSearch] = useState('')

  return (
    /* REMOVED: h-screen and overflow-y-auto */
    /* CHANGED: Kept sticky top-0 so it fixes in place naturally with the window scroll */
    <aside className="w-full flex-shrink-0 flex flex-col !gap-8 sticky top-0 !py-6 !px-4">

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

        {TRENDING.map((item, i) => (
          <div key={item.tag}
            className="flex items-center justify-between !px-5 !py-4 cursor-pointer transition-colors"
            style={{ borderBottom: i < TRENDING.length - 1 ? '1px solid var(--border)' : 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <p className="trend-num text-xs opacity-80">#{i + 1} · {item.category}</p>
              <p className="font-heading font-semibold text-sm mt-1" style={{ color: 'var(--white)' }}>
                #{item.tag}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {item.posts} posts
              </p>
            </div>
            <Zap size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
        ))}

        <div className="!px-5 !py-4">
          <button className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--light-purple)' }}>
            Show more
          </button>
        </div>
      </div>

      {/* Who to Follow Box */}
      <div className="lootr-card rounded-xl overflow-visible">
        <div className="!px-5 !py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-heading font-bold text-base" style={{ color: 'var(--white)' }}>
            Players to Follow
          </h3>
        </div>

        {SUGGESTIONS.map((person, i) => (
          <div key={person.username}
            className="flex items-center gap-4 !px-5 !py-4 cursor-pointer transition-colors"
            style={{ borderBottom: i < SUGGESTIONS.length - 1 ? '1px solid var(--border)' : 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Avatar */}
            <div className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `hsl(${i * 80 + 260}, 60%, 25%)` }}>
              <span className="font-heading font-bold text-sm" style={{ color: 'var(--light-purple)' }}>
                {person.display_name[0]}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--white)' }}>
                  {person.display_name}
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
                {person.followers} followers
              </p>
            </div>

            {/* Follow btn */}
            <button className="btn-ghost !px-4 !py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform active:scale-95">
              Follow
            </button>
          </div>
        ))}

        <div className="!px-5 !py-4">
          <button className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--light-purple)' }}>
            Show more
          </button>
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