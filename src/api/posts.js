import { supabase } from '../lib/supabaseClient'


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
    .select(POST_SELECT_QUERY)
    .order('created_at', { ascending: false })

  if (error) throw error
  return formatPostData(data, userId)
}

export const createNewPost = async (content, tags, userId) => {
  if (!content || !userId) return

  const { data: post, error } = await supabase
    .from('posts')
    .insert([{ content, user_id: userId }])
    .select()
    .single()

  if (error) throw error

  if (tags?.length > 0) {
    const { data: tagRows } = await supabase
      .from('tags')
      .select('id, name')
      .in('name', tags)

    const inserts = tagRows.map(t => ({ post_id: post.id, tag_id: t.id }))
    await supabase.from('post_tags').insert(inserts)
  }
}

export const fetchPostById = async (id, userId) => {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT_QUERY)
    .eq('id', id)
    .single()

  if (error) throw error
  
  // formatPostData expects an array, so pass it inside [data] and grab the first element
  return formatPostData([data], userId)[0]
}