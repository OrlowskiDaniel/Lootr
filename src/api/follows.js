import { supabase } from '../lib/supabaseClient'

export const toggleFollow = async (targetUserId, currentUserId) => {
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle()

  if (existing) {
    await supabase.from('follows').delete().eq('id', existing.id)
    return { following: false }
  } else {
    await supabase.from('follows').insert({
      follower_id: currentUserId,
      following_id: targetUserId
    })
    return { following: true }
  }
}

export const checkIfFollowing = async (targetUserId, currentUserId) => {
  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle()

  return !!data
}