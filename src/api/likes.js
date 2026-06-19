import { supabase } from '../lib/supabaseClient'

export const toggleLike = async (postId, userId) => {
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
    return { liked: false }
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: userId })
    return { liked: true }
  }
}