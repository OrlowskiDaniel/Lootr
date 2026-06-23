import { supabase } from '../lib/supabaseClient'

export const fetchPosts = async (userId) => {
// Shared data formatter to keep UI-ready shapes consistent
export const formatPostData = (posts, userId) => {
  return (posts || [])
    // FILTER OUT PRIVATE POSTS: If profiles.is_private is true, hide it
    .filter(post => !post.profiles?.is_private)
    // Map the remaining public posts to the layout structure
    .map(post => ({
      ...post,
      tags: post.post_tags?.map(pt => pt.tags) || [],
      likes_count: post.likes?.length || 0,
      liked_by_user: post.likes?.some(l => l.user_id === userId) || false,
      comments_count: post.comments?.[0]?.count ?? 0
    }))
}

// Fetch
const POST_SELECT_QUERY = `
  *,
  profiles(username, avatar_url, is_private),
  likes(user_id),
  comments(count),
  post_tags(tags(id, name, display_name))
`

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