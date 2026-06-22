import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { searchTags } from '../api/tags'

export default function ComposePost({ onPost }) {
  const { profile } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [tagSearch, setTagSearch] = useState('')
  const [tagResults, setTagResults] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // Fetch tag results based on search input
  useEffect(() => {
    if (!tagSearch) {
      setTagResults([])
      return
    }

    const fetchTags = async () => {
      const data = await searchTags(tagSearch)
      setTagResults(data || [])
    }

    fetchTags()
  }, [tagSearch])

  const addTag = (tag) => {
    if (selectedTags.find(t => t.id === tag.id)) return
    setSelectedTags([...selectedTags, tag])
    setTagSearch('')
    setTagResults([])
  }

  const removeTag = (id) => {
    setSelectedTags(selectedTags.filter(t => t.id !== id))
  }

  const handlePost = async () => {
    setLoading(true)
    const tagNames = selectedTags.map(t => t.name)
    await onPost?.(content.trim(), tagNames)

    setContent('')
    setSelectedTags([])
    setLoading(false)
  }

  return (
    <div className="border-b p-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex !gap-3">
        
        {/* Avatar */}
        <div
          className="avatar-ring w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--dark-purple)' }}
        >
          <img
            src={profile?.avatar_url || '/default-avatar.png'}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's your latest loot?"
            rows={3}
            className="w-full resize-none bg-transparent text-base leading-relaxed focus:outline-none"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'Inter, sans-serif',
              caretColor: 'var(--light-purple)',
            }}
          />

          <div className="neon-line !my-3" />

          {/* Main Controls Row */}
          <div className="flex flex-col !gap-3 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Tag Management */}
            <div className="relative flex-1 max-w-xs">
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

              {/* Tag Dropdown */}
              {tagResults.length > 0 && (
                <div
                  className="mt-1 rounded-lg overflow-y-auto max-h-60 shadow-lg absolute left-0 right-0 z-50"
                  style={{ background: 'var(--bg-hover)' }}
                >
                  {tagResults.map(tag => (
                    <div
                      key={tag.id}
                      onClick={() => addTag(tag)}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-[rgba(255,255,255,0.05)]" 
                    >
                      #{tag.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={!content.trim() || loading}
              className="btn-primary flex items-center justify-center! gap-2 !px-5 !py-2 rounded-full text-sm disabled:opacity-40 ml-auto"
            >
              {loading ? 'Posting...' : (
                <>
                  <Send size={14} />
                  LOOT IT
                </>
              )}
            </button>
          </div>

          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="flex !gap-2 !mt-3 flex-wrap">
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
          )}

        </div>
      </div>
    </div>
  )
}