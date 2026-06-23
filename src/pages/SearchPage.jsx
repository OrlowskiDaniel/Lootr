import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { searchUsers, searchPosts } from '../api/search'
import { formatPostData } from '../api/posts'
import PostCard from '../components/PostCard'
import { useAuth } from '../hooks/useAuth'
import { toggleLike } from '../api/likes'

export default function SearchPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const query = params.get('q')

  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [mode, setMode] = useState(null)

  useEffect(() => {
    if (!query) return

    const run = async () => {
      if (query.startsWith('@')) {
        const q = query.slice(1)
        const data = await searchUsers(q)
        setUsers(data)
        setMode('user')
      } else {
        const data = await searchPosts(query)
        
        // use the central formatter 
        const formatted = formatPostData(data, user?.id)
        
        setPosts(formatted)
        setMode('post')
      }
    }

    run()
  }, [query, user?.id])

  const likePost = async (postId) => {
    if (!user) return

    try {
      const result = await toggleLike(postId, user.id)
      const isLiked = result.liked

      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                likes_count: isLiked ? p.likes_count + 1 : p.likes_count - 1,
                liked_by_user: isLiked
              }
            : p
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="!p-4">
      {/* USERS */}
      {mode === 'user' && (
        <div>
          <h2 className="text-lg font-bold !mb-3">Users</h2>

          {users.map(u => (
            <div
              key={u.id}
              className="!p-3 border-b cursor-pointer"
              onClick={() => navigate(`/profile/${u.username}`)}
            >
              <p className="font-semibold">@{u.username}</p>
            </div>
          ))}
        </div>
      )}

      {/* POSTS */}
      {mode === 'post' && (
        <div>
          <h2 className="text-lg font-bold mb-3">Posts</h2>

          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={likePost} />
          ))}
        </div>
      )}
    </div>
  )
}