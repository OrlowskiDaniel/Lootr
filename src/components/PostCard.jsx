import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

function timeAgo(dateString) {
  const diff = (Date.now() - new Date(dateString)) / 1000
  if (diff < 60) return `${Math.floor(diff)}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export default function PostCard({ post, onLike }) {
  // FIX: was `!post.user` — the field is `post.profiles`, not `post.user`
  if (!post || !post.profiles) return null

  const user = post.profiles

  return (
    <article
      className="border-b !px-4 !py-4"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex !gap-3">

        {/* Avatar */}
        <Link to={`/profile/${user.username}`}>
          <div
            className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'var(--dark-purple)' }}
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span
                className="font-heading font-bold text-lg"
                style={{ color: 'var(--light-purple)' }}
              >
                {user.username?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1">

          {/* Header */}
          <div className="flex items-center !gap-2 text-sm">
            <Link
              to={`/profile/${user.username}`}
              className="font-heading font-bold"
              style={{ color: 'var(--white)' }}
            >
              {user.username}
            </Link>

            <span
              className="font-mono text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              @{user.username}
            </span>

            <span style={{ color: 'var(--text-muted)' }}>·</span>

            <span
              className="font-mono text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {timeAgo(post.created_at)}
            </span>
          </div>

          <div className="flex gap-2 mt-2 flex-wrap">
            {post.tags?.map(tag => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: 'var(--bg-hover)', color: 'var(--light-purple)' }}
              >
                #{tag.display_name}
              </span>
            ))}
          </div>

          {/* Content */}
          <Link to={`/post/${post.id}`}>
            <p
              className="mt-1.5 text-sm leading-relaxed"
              style={{ color: 'var(--text-primary)' }}
            >
              {post.content}
            </p>
          </Link>

          {/* Like */}
          <div className="!mt-3">
            <button
              onClick={() => {
                if (!onLike) return
                onLike(post.id)
              }}
              className="flex items-center !gap-2 text-xs"
              style={{
                color: post.liked_by_user ? '#ec4899' : 'var(--text-muted)',
              }}
            >
              <Heart
                size={16}
                fill={post.liked_by_user ? '#ec4899' : 'none'}
              />
              {post.likes_count ?? 0}
            </button>
          </div>
          {post.comments_count > 0 && (
            <div className="!mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              comments {post.comments_count}
            </div>
          )}

        </div>
      </div>
    </article>
  )
}