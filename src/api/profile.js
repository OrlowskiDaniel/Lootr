import { supabase } from '../lib/supabaseClient'

export const getProfileByUsername = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) throw error
  return data
}

export const getPostsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles(username, avatar_url), likes(user_id)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map(post => ({
    ...post,
    likes_count: (post.likes || []).length,
    liked_by_user: (post.likes || []).some(
        l => l.user_id === supabase.auth.getUser()?.data?.user?.id
    )
  }))
}

export const upsertProfile = async (profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getFollowersCount = async (userId) => {
  const { count, error } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId)

  if (error) {
    console.error("Error fetching follower count:", error)
    return 0
  }

  return count ?? 0
}