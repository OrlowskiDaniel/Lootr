import { useState } from 'react'
import { Zap } from 'lucide-react'
import ComposePost from '../components/ComposePost'
import FeedTabs from '../components/FeedTabs'
import PostCard from '../components/PostCard'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import { usePosts } from '../hooks/usePosts'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you')
  const { posts, loading, likePost, createPost } = usePosts(activeTab)

  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(13,13,13,0.85)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap size={18} style={{ color: 'var(--light-purple)' }} />
            <h1 className="font-heading font-bold text-lg tracking-wide" style={{ color: 'var(--white)' }}>
              Home
            </h1>
          </div>
        </div>
        <FeedTabs active={activeTab} onChange={setActiveTab} />
      </header>

      {/* Compose */}
      <ComposePost onPost={createPost} />

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          message="Follow some players or post your first loot!"
        />
      ) : (
        <div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={likePost} />
          ))}
        </div>
      )}
    </>
  )
}
