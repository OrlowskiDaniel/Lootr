import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import ComposePost from '../components/ComposePost'
import FeedTabs from '../components/FeedTabs'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'
import { fetchPosts } from '../api/posts'
import { toggleLike } from '../api/likes'
import { useSearchParams } from 'react-router-dom'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const activeTag = searchParams.get('tag')

  const fetchPosts = async () => {
    setLoading(true)

    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles(username, avatar_url),
          likes(user_id),
          comments(count),
          post_tags(
            tags(id, name, display_name)
          )
        `)
        .order('created_at', { ascending: false })

      const { data, error } = activeTag
        ? await supabase
            .from('post_tags')
            .select(`
              posts(
                *,
                profiles(username, avatar_url),
                likes(user_id),
                comments(count),
                post_tags(
                  tags(id, name, display_name)
                )
              ),
              tags!inner(name)
            `)
            .eq('tags.name', activeTag)
        : await query

      if (error) throw error

      const postsData = activeTag
        ? data.map(d => d.posts)
        : data

      const formatted = postsData.map(post => ({
        ...post,
        tags: post.post_tags.map(pt => pt.tags),
        likes_count: (post.likes || []).length,
        liked_by_user: (post.likes || []).some(l => l.user_id === user?.id),
        comments_count: post.comments?.[0]?.count ?? 0
      }))

      setPosts(formatted)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [activeTab, activeTag])

  const createPost = async (content, tags = []) => {
    if (!content || !user) return

    // create post
    const { data: post, error } = await supabase
      .from('posts')
      .insert([{ content, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    // attach tags
    if (tags.length > 0) {
      const { data: tagRows } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', tags)

      const inserts = tagRows.map(t => ({
        post_id: post.id,
        tag_id: t.id
      }))

      await supabase.from('post_tags').insert(inserts)
    }

    fetchPosts()
  }

  const likePost = async (postId) => {
    if (!user) return

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          })
      }

      // ⚡ Optimistic update (better UX)
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                likes_count: existingLike
                  ? p.likes_count - 1
                  : p.likes_count + 1,
                liked_by_user: !existingLike
              }
            : p
        )
      )
    } catch (err) {
      console.error(err)
    }
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