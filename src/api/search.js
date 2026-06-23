import { supabase } from '../lib/supabaseClient'

// search users
export const searchUsers = async (query) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(5)

  if (error) throw error
  return data || []
}

// search posts
export const searchPosts = async (query) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(username, avatar_url)
    `)
    .ilike('content', `%${query}%`)
    .limit(10)

  if (error) throw error
  return data || []
}