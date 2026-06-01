import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const MAX_CHARS = 280

export default function ComposePost({ onPost }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  // const remaining = MAX_CHARS - content.length
  // const isOverLimit = remaining < 0
  const isEmpty = content.trim().length === 0


  const handlePost = async () => {
    if (isEmpty) return
    setLoading(true)
    await onPost?.(content.trim())
    setContent('')
    setLoading(false)
  }

  const handleInput = (e) => {
    setContent(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  return (
    <div className="border-b px-4 py-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex gap-3">
        
        {/* Avatar */}
        <div
          className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--dark-purple)' }}
        >
          {user?.avatar_url ? (
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
              {user?.username?.[0]?.toUpperCase() ?? 'G'}
            </span>
          )}
        </div>

        <div className="flex-1">
          
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            placeholder="What's your latest loot?"
            rows={2}
            className="w-full resize-none bg-transparent text-base leading-relaxed focus:outline-none"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              caretColor: 'var(--light-purple)',
            }}
          />

          <div className="neon-line my-3" />

          <div className="flex items-center justify-between">
            
            {/* Counter */}
            {/* <span
              className="font-mono text-xs"
              style={{
                color: isOverLimit
                  ? '#ef4444'
                  : remaining < 40
                  ? '#f59e0b'
                  : 'var(--text-muted)',
              }}
            >
              {remaining}
            </span> */}

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={isEmpty || loading}
              className="btn-primary flex items-center gap-2 px-5 py-2 rounded-full text-sm disabled:opacity-40"
            >
              {loading ? (
                'Posting...'
              ) : (
                <>
                  <Send size={14} />
                  LOOT IT
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}