import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getCommentsByPost, createComment } from '../api/comments'
import { fetchPostById } from '../api/posts' 
import PostCard from '../components/PostCard'
import CommentCard from '../components/CommentCard'
import { toggleLike } from '../api/likes'

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    load()
  }, [id, user?.id])

  const load = async () => {
    try {
      const postData = await fetchPostById(id, user?.id)
      setPost(postData)

      const commentsData = await getCommentsByPost(id)
      setComments(commentsData)
    } catch (err) {
      console.error("Error loading post data:", err)
    }
  }

  const likePost = async (postId) => {
    if (!user) return

    try {
      // Tell Supabase to toggle the like and get back the true true/false status
      const result = await toggleLike(postId, user.id)
      const isLiked = result.liked

      // Directly update our single post state based on what the server said
      setPost(prevPost => {
        if (!prevPost) return null
        
        return {
          ...prevPost,
          liked_by_user: isLiked,
          likes_count: isLiked ? prevPost.likes_count + 1 : prevPost.likes_count - 1
        }
      })
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  const handleComment = async () => {
    if (!text || !user) return

    try {
      const newComment = await createComment(text, id, user.id)
      setComments(prev => [...prev, newComment])
      setText('')
      
      setPost(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null)
    } catch (err) {
      console.error("Failed to post comment:", err)
    }
  }

  if (!post) return <p className="!p-4">Loading...</p>

  return (
    <div>
      <PostCard post={post} onLike={likePost} />

      {/* Comment box */}
      <div className="!p-4 border-b">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full !p-2 bg-transparent border-[var(--bg-hover)] text-[var(--text-primary)] rounded focus:outline-none"
        />
        <button onClick={handleComment} className="btn-primary flex items-center !gap-2 !px-5 !py-2 rounded-full text-sm ">
          Comment
        </button>
      </div>

      {/* Comments */}
      <div>
        {comments.map(c => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>
    </div>
  )
}