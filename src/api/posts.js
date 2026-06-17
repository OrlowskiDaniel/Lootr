import { supabase } from '../lib/supabaseClient'

export const fetchPosts = async (userId) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles(username, avatar_url), likes(user_id)`)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map(post => ({
    ...post,
    likes_count: post.likes.length,
    liked_by_user: post.likes.some(l => l.user_id === userId)
  }))
}