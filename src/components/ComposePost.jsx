import { useState, useRef } from 'react'
import { Image, Smile, Hash, Gamepad2, X, Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const MAX_CHARS = 280

export default function ComposePost({ onPost }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  const remaining = MAX_CHARS - content.length
  const isOverLimit = remaining < 0
  const isEmpty = content.trim().length === 0

  const handlePost = async () => {
    if (isEmpty || isOverLimit) return
    setLoading(true)
    await onPost?.(content.trim(), tags)
    setContent('')
    setTags([])
    setLoading(false)
  }

  const addTag = () => {
    const t = tagInput.replace(/[^a-zA-Z0-9]/g, '').trim()
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t])
    }
    setTagInput('')
  }

  const removeTag = (tag) => setTags(tags.filter(t => t !== tag))

  // Auto-resize textarea
  const handleInput = (e) => {
    setContent(e.target.value)
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
  }

  return (
    <div className="border-b px-4 py-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--dark-purple)' }}>
          {user?.avatar_url
            ? <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            : <span className="font-heading font-bold text-lg" style={{ color: 'var(--light-purple)' }}>
                {user?.username?.[0]?.toUpperCase() ?? 'G'}
              </span>
          }
        </div>

        <div className="flex-1 min-w-0">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            placeholder="What's your latest loot? Share your gaming moment..."
            rows={2}
            className="w-full resize-none bg-transparent text-base leading-relaxed placeholder:text-base focus:outline-none"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              caretColor: 'var(--light-purple)',
            }}
          />

          {/* Tags display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(tag => (
                <span key={tag} className="lootr-tag flex items-center gap-1">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:opacity-70">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag input */}
          {showTagInput && (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Add a game tag (e.g. Valorant)"
                className="lootr-input text-sm px-3 py-1.5 rounded-lg flex-1"
              />
              <button onClick={addTag}
                className="btn-ghost px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                Add
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="neon-line my-3" />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[
                { icon: Image, label: 'Image' },
                { icon: Smile, label: 'Emoji' },
                { icon: Gamepad2, label: 'Game tag', onClick: () => setShowTagInput(!showTagInput) },
              ].map(({ icon: Icon, label, onClick }) => (
                <button key={label} onClick={onClick}
                  title={label}
                  className="p-2 rounded-lg transition-all hover:opacity-80 cursor-pointer"
                  style={{ color: 'var(--light-purple)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(123,47,190,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Character counter */}
              {content.length > 0 && (
                <span className="font-mono text-xs"
                  style={{ color: isOverLimit ? '#ef4444' : remaining < 40 ? '#f59e0b' : 'var(--text-muted)' }}>
                  {remaining}
                </span>
              )}

              {/* Post button */}
              <button
                onClick={handlePost}
                disabled={isEmpty || isOverLimit || loading}
                className="btn-primary flex items-center gap-2 px-5 py-2 rounded-full text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="font-heading font-bold tracking-wider">Posting...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span className="font-heading font-bold tracking-wider">LOOT IT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
