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
    console.log('fetchPosts started')
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`*, profiles(username, avatar_url), likes(user_id)`)
        .order('created_at', { ascending: false })

      console.log('posts result:', { data: postsData, error: postsError })

      if (postsError) throw postsError

      const formatted = (postsData ?? []).map(post => ({
        ...post,
        likes_count: (post.likes || []).length,
        liked_by_user: (post.likes || []).some(like => like.user_id === user?.id)
      }))
      setPosts(formatted)
    } catch (err) {
      console.error('fetchPosts error:', err)
    } finally {
      setLoading(false)
    }
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
    if (!user) return

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingLike) {
      // UNLIKE
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
    } else {
      // LIKE
      await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })
    }

    fetchPosts()
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