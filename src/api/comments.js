import { supabase } from '../lib/supabaseClient'

export const getCommentsByPost = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles(username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const createComment = async (content, postId, userId) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      content,
      post_id: postId,
      user_id: userId
    })
    .select(`
      *,
      profiles(username, avatar_url)
    `)
    .single()

  if (error) throw error
  return data
}