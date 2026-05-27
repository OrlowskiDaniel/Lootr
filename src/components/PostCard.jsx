import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Swords, Zap } from 'lucide-react'

function timeAgo(dateString) {
  const diff = (Date.now() - new Date(dateString)) / 1000
  if (diff < 60)   return `${Math.floor(diff)}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function formatCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function PostCard({ post, onLike }) {
  const [showMenu, setShowMenu] = useState(false)
  const [reposted, setReposted] = useState(false)

  const { user } = post

  return (
    <article
      className="lootr-card border-b px-4 py-4 cursor-pointer animate-fade-in-up"
      style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Link to={`/profile/${user.username}`} className="flex-shrink-0">
          <div className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: `hsl(${user.username.charCodeAt(0) * 5 + 250}, 50%, 22%)` }}>
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              : <span className="font-heading font-bold text-lg" style={{ color: 'var(--light-purple)' }}>
                  {user.username[0].toUpperCase()}
                </span>
            }
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/profile/${user.username}`}
                className="font-heading font-bold text-sm hover:underline transition-colors"
                style={{ color: 'var(--white)' }}>
                {user.display_name || user.username}
              </Link>
              {user.is_verified && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--purple)' }}>
                  <svg width="9" height="9" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                @{user.username}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                {timeAgo(post.created_at)}
              </span>
            </div>

            {/* More menu */}
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full transition-colors hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}>
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 z-10 w-44 rounded-lg border overflow-hidden shadow-xl"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {['Mute', 'Block', 'Report', 'Copy link'].map(action => (
                    <button key={action} onClick={() => setShowMenu(false)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: 'var(--silver)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post text */}
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {post.content}
          </p>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.tags.map(tag => (
                <Link key={tag} to={`/explore?tag=${tag}`} className="lootr-tag hover:opacity-80 transition-opacity">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-xs">
            {/* Like */}
            <button onClick={() => onLike?.(post.id)}
              className="flex items-center gap-1.5 group transition-colors"
              style={{ color: post.liked_by_user ? '#ec4899' : 'var(--text-muted)' }}>
              <Heart size={16}
                className="transition-transform group-hover:scale-110"
                fill={post.liked_by_user ? '#ec4899' : 'none'}
                style={{ filter: post.liked_by_user ? 'drop-shadow(0 0 4px #ec4899)' : 'none' }}
              />
              <span className="font-mono text-xs">{formatCount(post.likes_count)}</span>
            </button>

            {/* Comment */}
            <Link to={`/post/${post.id}`}
              className="flex items-center gap-1.5 group transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--light-purple)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <MessageCircle size={16} className="transition-transform group-hover:scale-110" />
              <span className="font-mono text-xs">{formatCount(post.comments_count)}</span>
            </Link>

            {/* Repost */}
            <button onClick={() => setReposted(!reposted)}
              className="flex items-center gap-1.5 group transition-colors"
              style={{ color: reposted ? '#22c55e' : 'var(--text-muted)' }}>
              <Repeat2 size={16}
                className="transition-transform group-hover:scale-110"
                style={{ filter: reposted ? 'drop-shadow(0 0 4px #22c55e)' : 'none' }}
              />
              <span className="font-mono text-xs">{formatCount(post.reposts_count + (reposted ? 1 : 0))}</span>
            </button>

            {/* Challenge / Battle */}
            <button
              className="flex items-center gap-1.5 group transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Swords size={16} className="transition-transform group-hover:scale-110" />
            </button>

            {/* Share */}
            <button
              className="flex items-center gap-1.5 group transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--light-purple)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Share size={16} className="transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
