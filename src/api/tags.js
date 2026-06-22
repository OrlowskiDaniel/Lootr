import { supabase } from '../lib/supabaseClient'

/**
 * GET TRENDING TAGS
 * ask
 * sorted from highest to lowest, and take the top 10
 */
export const getTrendingTags = async () => {
  const { data } = await supabase
    .from('tags')
    .select('name, display_name, category, count') 
    .order('count', { ascending: false })          // Highest count first
    .limit(10)                                     // stop at 10

  return data || []
}

/**
 * SEARCH TAGS
 * Looks for tags where the name or display name looks like the search query.
 */
export const searchTags = async (query) => {
  const { data } = await supabase
    .from('tags')
    .select('*')
    .or(`name.ilike.%${query}%,display_name.ilike.%${query}%`) // Simple 'either/or' search
    .limit(5)

  return data || []
}

/**
 * GET POSTS BY TAG
 * fetches posts that have a specific tag, along with who wrote it 
 * and who liked it
 */
export const getPostsByTag = async (tagName, userId) => {
  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(username, avatar_url),
      likes(user_id),
      post_tags!inner(tags!inner(name))
    `)
    .eq('post_tags.tags.name', tagName) // only get posts matching this tag name

  // clean up the data structure so it is ready for the UI
  return (data || []).map(post => {
    return {
      ...post,
      likes_count: post.likes ? post.likes.length : 0,
      liked_by_user: post.likes ? post.likes.some(like => like.user_id === userId) : false
    }
  })
}