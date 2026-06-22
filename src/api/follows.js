import { supabase } from '../lib/supabaseClient'


// follow / unfallow
export const toggleFollow = async (targetUserId, currentUserId) => {
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('follows')
      .delete()
      .eq('id', existing.id)

    return { following: false }
  } else {
    await supabase
      .from('follows')
      .insert({
        follower_id: currentUserId,
        following_id: targetUserId
      })

    return { following: true }
  }
}


// check if fallowing
export const checkIfFollowing = async (targetUserId, currentUserId) => {
  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', targetUserId)
    .maybeSingle()

  return !!data
}


  // get populair users
export const getPopularUsers = async () => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, user_id, username, avatar_url')

  if (error) throw error

  const withCounts = await Promise.all(
    profiles.map(async (user) => {
      const { count } = await supabase
        .from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', user.user_id)

      return {
        ...user,
        followers: count || 0
      }
    })
  )

  return withCounts
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5)
}