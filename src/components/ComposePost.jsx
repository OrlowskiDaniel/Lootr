import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { searchTags } from '../api/tags'
import { useEffect } from 'react'

const MAX_CHARS = 280

export default function ComposePost({ onPost }) {
  const { user, profile } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)
  const [tagSearch, setTagSearch] = useState('')
  const [tagResults, setTagResults] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // const remaining = MAX_CHARS - content.length
  // const isOverLimit = remaining < 0
  const isEmpty = content.trim().length === 0

  useEffect(() => {
    const run = async () => {
      if (!tagSearch) {
        setTagResults([])
        return
      }

      const data = await searchTags(tagSearch)
      console.log('TAG RESULTS:', data) // debug
      setTagResults(data)
    }

    run()
  }, [tagSearch])

  const addTag = (tag) => {
    if (selectedTags.find(t => t.id === tag.id)) return
    setSelectedTags(prev => [...prev, tag])
    setTagSearch('')
    setTagResults([])
  }

  const removeTag = (id) => {
    setSelectedTags(prev => prev.filter(t => t.id !== id))
  }


  const handlePost = async () => {
    if (isEmpty) return
    setLoading(true)

    const tags = selectedTags.map(t => t.name)

    await onPost?.(content.trim(), tags)

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
    <div className="border-b !px-4 !py-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex !gap-3">
        
        {/* Avatar */}
        <div
          className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--dark-purple)' }}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
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

          <div className="neon-line !my-3" />

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

            {/* Tag search */}
            <div className="mt-3 relative">
              <input
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search game tags..."
                className="w-full !px-3 !py-2 rounded-lg text-sm"
                style={{
                  background: 'var(--bg-hover)',
                  color: 'var(--text-primary)'
                }}
              />

              {/* Dropdown */}
              {tagResults.length > 0 && (
                <div
                  className="!mt-1 rounded-lg overflow-y-auto max-h-60 shadow-lg"
                  style={{
                    background: 'var(--bg-hover)',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    zIndex: 50
                  }}
                >
                  {tagResults.map(tag => (
                    <div
                      key={tag.id}
                      onClick={() => addTag(tag)}
                      className="!px-3 !py-2 text-sm cursor-pointer hover:bg-[rgba(255,255,255,0.05)]" 
                    >
                      #{tag.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected tags */}
            <div className="flex !gap-2 !mt-2 flex-wrap">
              {selectedTags.map(tag => (
                <span
                  key={tag.id}
                  onClick={() => removeTag(tag.id)}
                  className="text-xs !px-2 !py-1 rounded-full cursor-pointer"
                  style={{
                    background: 'var(--bg-hover)',
                    color: 'var(--light-purple)'
                  }}
                >
                  #{tag.display_name} ✕
                </span>
              ))}
            </div>

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={isEmpty || loading}
              className="btn-primary flex items-center !gap-2 !px-5 !py-2 rounded-full text-sm disabled:opacity-40"
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