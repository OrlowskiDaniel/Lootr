import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// ─── Mock data for UI development ────────────────────────────────────────────
const MOCK_POSTS = [
  {
    id: '1',
    content: 'Just hit Diamond rank in Valorant after 200 hours. The grind was real but totally worth it. GGs to everyone I queued with 🏆',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    likes_count: 142,
    comments_count: 23,
    reposts_count: 8,
    user: { id: '2', username: 'ValorantKing', display_name: 'ValorantKing', avatar_url: null, is_verified: true },
    tags: ['Valorant', 'Diamond'],
    liked_by_user: false,
  },
  {
    id: '2',
    content: 'New Elden Ring DLC drops next week. I have taken three days off work. My body is ready. My boss is not aware.',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes_count: 891,
    comments_count: 104,
    reposts_count: 201,
    user: { id: '3', username: 'SoulsBorneFan', display_name: 'SoulsBorneFan', avatar_url: null, is_verified: false },
    tags: ['EldenRing', 'Soulslike'],
    liked_by_user: true,
  },
  {
    id: '3',
    content: 'Hot take: Minecraft is still the greatest game ever made 10+ years later. No other game comes close in terms of creativity and longevity.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    likes_count: 2341,
    comments_count: 432,
    reposts_count: 566,
    user: { id: '4', username: 'BlockMaster99', display_name: 'BlockMaster99', avatar_url: null, is_verified: false },
    tags: ['Minecraft', 'HotTake'],
    liked_by_user: false,
  },
  {
    id: '4',
    content: 'My PC build is finally done after 6 months of saving. RTX 4080, i9-13900K, 64GB DDR5. Ready to run Cyberpunk at max settings like a god.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes_count: 654,
    comments_count: 89,
    reposts_count: 34,
    user: { id: '5', username: 'PCMasterRace', display_name: 'PCMasterRace', avatar_url: null, is_verified: true },
    tags: ['PCGaming', 'BuildComplete'],
    liked_by_user: false,
  },
]

// ─── Hook ────────────────────────────────────────────────────────────────────
export function usePosts(feedType = 'for-you') {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // TODO: Fetch posts from Supabase based on feedType
    // const fetchPosts = async () => {
    //   setLoading(true)
    //   const { data, error } = await supabase
    //     .from('posts')
    //     .select(`*, user:profiles(*), likes(count), comments(count)`)
    //     .order('created_at', { ascending: false })
    //   if (error) setError(error)
    //   else setPosts(data)
    //   setLoading(false)
    // }
    // fetchPosts()
  }, [feedType])

  const likePost = async (postId) => {
    // TODO: Toggle like in Supabase
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, liked_by_user: !p.liked_by_user, likes_count: p.liked_by_user ? p.likes_count - 1 : p.likes_count + 1 }
          : p
      )
    )
  }

  const createPost = async (content, tags = []) => {
    // TODO: Insert post into Supabase
    const newPost = {
      id: String(Date.now()),
      content,
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      user: { id: '1', username: 'GamerPro', display_name: 'GamerPro', avatar_url: null, is_verified: false },
      tags,
      liked_by_user: false,
    }
    setPosts(prev => [newPost, ...prev])
  }

  return { posts, loading, error, likePost, createPost }
}
