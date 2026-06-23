import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import ComposePost from '../components/ComposePost'
import FeedTabs from '../components/FeedTabs'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'

import { useAuth } from '../hooks/useAuth'
import { fetchHomeFeed, createNewPost } from '../api/posts'
import { toggleLike } from '../api/likes'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const activeTag = searchParams.get('tag')

  const loadFeed = async () => {
    setLoading(true)
    try {
      const feedData = await fetchHomeFeed({ activeTab, activeTag, userId: user?.id })
      setPosts(feedData)
    } catch (err) {
      console.error('Error loading feed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeed()
  }, [activeTab, activeTag, user?.id])

  const handleCreatePost = async (content, tags = []) => {
    try {
      await createNewPost(content, tags, user?.id)
      loadFeed()
    } catch (err) {
      console.error('Error creating post:', err)
    }
  }

  const handleLikePost = async (postId) => {
    if (!user) return

    // Find the target post to see its current state
    const targetPost = posts.find(p => p.id === postId)
    if (!targetPost) return

    const wasLiked = targetPost.liked_by_user

    // Flip the state instantly in the UI
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post // Leave other posts alone
        
        return {
          ...post,
          liked_by_user: !wasLiked,
          likes_count: wasLiked ? post.likes_count - 1 : post.likes_count + 1
        }
      })
    )

    // Update Supabase in the background
    try {
      await toggleLike(postId, user.id)
    } catch (err) {
      console.error('Like failed, reverting...', err)
      loadFeed() // Re-fetch from database if something went wrong
    }
  }

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(13,13,13,0.85)' }}
      >
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

      <ComposePost onPost={handleCreatePost} />

      {loading ? (
        <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          Loading...
        </p>
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet" message="Follow some players or post your first loot!" />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLikePost} />
          ))}
        </div>
      )}
    </>
  )
}