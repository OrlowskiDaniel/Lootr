import { supabase } from '../lib/supabaseClient'


 // Fetches the top 10 trending tags based on their usage frequency.
 // Retrieves tag data, aggregates the counts in-memory, and sorts them descending.

export const getTrendingTags = async () => {
  // Fetch all post-to-tag relationships along with the associated tag details
  const { data } = await supabase
    .from('post_tags')
    .select('tag_id, tags(name, display_name, category)')

  // Aggregate the frequency of each tag
  const counts = {}
  data.forEach(row => {
    const name = row.tags.name
    // Initialize the tag object if it doesn't exist yet, then increment the counter
    counts[name] = counts[name] || { ...row.tags, count: 0 }
    counts[name].count++
  })

  // Convert the object back to an array, sort by highest count, and return the top 10
  return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 10)
}


// Searches for tags matching a partial query string.
// Checks both the 'name' and 'display_name' fields case-insensitively.
export const searchTags = async (query) => {
  // Query the tags table for records matching the search term, capped at 5 results
  const { data } = await supabase
    .from('tags')
    .select('*')
    .or(`name.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(5)

  return data || []
}


// Retrieves all posts associated with a specific tag name.
// Automatically appends author profiles, engagement metrics, and user-specific like status.

export const getPostsByTag = async (tagName, userId) => {
  // Query posts, joining profiles, likes, and filtering deeply via the junction table
  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      profiles(username, avatar_url),
      likes(user_id),
      post_tags!inner(tags!inner(name))
    `)
    .eq('post_tags.tags.name', tagName)

  // Map and transform the database results into a flattened, UI-ready structure
  return (data || []).map(post => ({
    ...post,
    likes_count: post.likes?.length || 0,
    liked_by_user: post.likes?.some(l => l.user_id === userId) || false
  }))
}