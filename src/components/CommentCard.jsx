import React from 'react'
import { Link } from 'react-router-dom'

function timeAgo(dateString) {
  const diff = (Date.now() - new Date(dateString)) / 1000
  if (diff < 60) return `${Math.floor(diff)}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export default function CommentCard({ comment }) {
  if (!comment || !comment.profiles) return null

  const user = comment.profiles

  return (
    <div 
      className="border-b !px-4 !py-3 flex !gap-3"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Avatar */}
      <Link to={`/profile/${user.username}`}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
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
              className="font-heading font-bold text-sm"
              style={{ color: 'var(--light-purple)' }}
            >
              {user.username?.[0]?.toUpperCase() ?? '?'}
            </span>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center !gap-2 text-xs">
          <Link
            to={`/profile/${user.username}`}
            className="font-heading font-bold"
            style={{ color: 'var(--white)' }}
          >
            {user.username}
          </Link>

          <span style={{ color: 'var(--text-muted)' }}>·</span>

          <span
            className="font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            {timeAgo(comment.created_at)}
          </span>
        </div>

        {/* Text */}
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{ color: 'var(--text-primary)' }}
        >
          {comment.content}
        </p>
      </div>
    </div>
  )
}