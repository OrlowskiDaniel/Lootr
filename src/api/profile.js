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
    likes_count: (post.likes || []).length
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