import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Search, Bell, Mail, Bookmark, User, Settings,
  Gamepad2, Trophy, Swords, Zap, Plus, LogOut,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../api/auth'

const NAV_ITEMS = [
  { to: '/',         icon: Home,      label: 'Home' },
  { to: '/explore',  icon: Search,    label: 'Explore' },
  { to: '/battles',  icon: Swords,    label: 'Battles' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/notifications', icon: Bell, label: 'Alerts', badge: 3 },
  { to: '/messages', icon: Mail,      label: 'Messages' },
  { to: '/bookmarks',icon: Bookmark,  label: 'Saved' },
  { to: '/profile',  icon: User,      label: 'Profile' },
  { to: '/settings', icon: Settings,  label: 'Settings' },
  { to: '/auth',     icon: LogOut,    label: 'logout'},
  
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="relative h-screen w-64 flex flex-col border-r z-40"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>

      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
				<img src="Lootr-logo.png" alt="Lootr Logo" className="" />
        <NavLink to="/" className="flex items-center gap-2 group">
					
          <div className="relative">
            <Gamepad2 size={28} style={{ color: 'var(--light-purple)' }}
              className="group-hover:animate-pulse transition-all" />
            <div className="absolute inset-0 blur-md opacity-60"
              style={{ background: 'var(--light-purple)' }} />
          </div>
          <span className="font-display text-2xl font-bold tracking-widest glow-text"
            style={{ color: 'var(--light-purple)' }}>
            LOOTR
          </span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
              ${isActive
                ? 'nav-active'
                : 'hover:bg-opacity-10'}`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(123,47,190,0.15)' : 'transparent',
              color: isActive ? 'var(--light-purple)' : 'var(--silver)',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20}
                  style={{ filter: isActive ? 'drop-shadow(0 0 6px var(--light-purple))' : 'none' }} />
                <span className="font-heading font-semibold text-base tracking-wide">{label}</span>
                {badge && (
                  <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--purple)', color: 'white', minWidth: '20px', textAlign: 'center' }}>
                    {badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                    style={{ background: 'var(--light-purple)', boxShadow: '0 0 8px var(--light-purple)' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Post Button */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg cursor-pointer"
        >
          <Plus size={18} />
          <span className="font-heading font-bold tracking-widest text-sm">NEW LOOT</span>
        </button>
      </div>

      {/* User profile strip */}
      {user && (
        <div className="px-4 py-3 border-t flex items-center gap-3 group cursor-pointer hover:bg-opacity-5"
          style={{ borderColor: 'var(--border)', background: 'rgba(123,47,190,0.05)' }}>
          <div className="avatar-ring w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--dark-purple)' }}>
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              : <span className="font-heading font-bold text-sm" style={{ color: 'var(--light-purple)' }}>
                  {user.username?.[0]?.toUpperCase()}
                </span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-sm truncate" style={{ color: 'var(--white)' }}>
              {user.display_name || user.username}
            </p>
            <p className="font-mono text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              @{user.username}
            </p>
          </div>
          <button onClick={signOut} className="p-1.5 rounded hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  )
}
