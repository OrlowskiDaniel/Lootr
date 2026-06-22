import { supabase } from '../lib/supabaseClient'

// get trending tags
export const getTrendingTags = async () => {
  const { data, error } = await supabase
    .from('post_tags')
    .select(`
      tag_id,
      tags(name, display_name, category)
    `)

  if (error) throw error

  // group manually
  const map = {}

  data.forEach(row => {
    const tag = row.tags
    if (!map[tag.name]) {
      map[tag.name] = {
        ...tag,
        count: 0
      }
    }
    map[tag.name].count++
  })

  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

// search tags
export const searchTags = async (query) => {
  if (!query) return []

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .or(`name.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(5)

  if (error) throw error

  return data
}

// posts by tag
export const getPostsByTag = async (tagName, userId) => {
  const { data, error } = await supabase
    .from('post_tags')
    .select(`
      posts(
        *,
        profiles(username, avatar_url),
        likes(user_id),
        post_tags(
          tags(id, name, display_name)
        )
      ),
      tags!inner(name)
    `)
    .eq('tags.name', tagName)

  if (error) throw error

  return data.map(row => {
    const post = row.posts

    return {
      ...post,
      tags: post.post_tags.map(pt => pt.tags),
      likes_count: (post.likes || []).length,
      liked_by_user: (post.likes || []).some(l => l.user_id === userId)
    }
  })
}