import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Search, Bell, Mail, Bookmark, User, Settings,
  Gamepad2, Trophy, Swords, Zap, Plus, LogOut
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/notifications', icon: Bell, label: 'Alerts', badge: 3 },
  { to: '/messages', icon: Mail, label: 'Messages' },
  { to: '/bookmarks', icon: Bookmark, label: 'Saved' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <aside
      className="fixed h-screen w-64 flex flex-col border-r z-30"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        
        <NavLink to="/" className="flex items-center gap-2 group">
          <img
            src="/Lootr-logo.png"
            alt="Lootr Logo"
            className="w-auto h-auto object-contain"
          />
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => {
          let finalPath = to

          // Dynamic profile route
          if (to === '/profile') {
            finalPath = profile?.username
              ? `/profile/${profile.username}`
              : '/auth'
          }

          return (
            <NavLink
              key={to}
              to={finalPath}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive ? 'nav-active' : 'hover:bg-opacity-10'}`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(123,47,190,0.15)' : 'transparent',
                color: isActive ? 'var(--light-purple)' : 'var(--silver)',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    style={{
                      filter: isActive
                        ? 'drop-shadow(0 0 6px var(--light-purple))'
                        : 'none',
                    }}
                  />
                  <span className="font-heading font-semibold text-base tracking-wide">
                    {label}
                  </span>

                  {badge && (
                    <span
                      className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: 'var(--purple)',
                        color: 'white',
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {badge}
                    </span>
                  )}

                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                      style={{
                        background: 'var(--light-purple)',
                        boxShadow: '0 0 8px var(--light-purple)',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Post Button */}
      <div className="!px-4 !py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full flex items-center justify-center !gap-2 !py-2.5 !px-4 rounded-lg cursor-pointer"
        >
          <Plus size={18} />
          <span className="font-heading font-bold tracking-widest text-sm">
            NEW LOOT
          </span>
        </button>
      </div>

      {/* Auth Button */}
      <div className="!px-4 !py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        {user ? (
          <button
            onClick={signOut}
            className="btn-ghost w-full flex items-center justify-center !gap-2 !py-2 rounded-lg"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary w-full flex items-center justify-center !gap-2 !py-2 rounded-lg"
          >
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* User profile strip */}
      {user && (
        <div
          onClick={() => navigate(`/profile/${profile?.username}`)}
          className="!px-4 !py-3 border-t flex items-center !gap-3 group cursor-pointer hover:bg-opacity-5"
          style={{
            borderColor: 'var(--border)',
            background: 'rgba(123,47,190,0.05)',
          }}
        >
          <div
            className="avatar-ring w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--dark-purple)' }}
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img
                src="/default-avatar.png"
                alt="default avatar"
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="font-heading font-semibold text-sm truncate"
              style={{ color: 'var(--white)' }}
            >
              {profile?.username}
            </p>
            <p
              className="font-mono text-xs truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              @{profile?.username}
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}