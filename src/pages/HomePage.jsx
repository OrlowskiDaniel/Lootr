import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import ComposePost from '../components/ComposePost'
import FeedTabs from '../components/FeedTabs'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchPosts = async () => {
    setLoading(true)

    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error.message)
      setLoading(false)
      return
    }

    const postsWithUsers = await Promise.all(
      postsData.map(async (post) => {
        const { data: userData } = await supabase
          .from('profiles')
          .select('user_id, username, avatar_url')
          .eq('user_id', post.user_id)
          .maybeSingle()

        return { ...post, user: userData }
      })
    )

    setPosts(postsWithUsers)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [activeTab])

  const createPost = async (content) => {
    if (!content || !user) return

    const { error } = await supabase
      .from('posts')
      .insert([{ content, user_id: user.id }])

    if (error) {
      console.error('Error creating post:', error.message)
    } else {
      fetchPosts()
    }
  }

  const likePost = async (postId) => {
    console.log('liked:', postId)
  }

  return (
    <>
      {/* Sticky header */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(13,13,13,0.85)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap size={18} style={{ color: 'var(--light-purple)' }} />
            <h1
              className="font-heading font-bold text-lg tracking-wide"
              style={{ color: 'var(--white)' }}
            >
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
        <p className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
          Loading...
        </p>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          message="Follow some players or post your first loot!"
        />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={likePost}
            />
          ))}
        </div>
      )}
    </>
  )
}