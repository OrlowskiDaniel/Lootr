import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { getCommentsByPost, createComment } from '../api/comments'
import PostCard from '../components/PostCard'
import CommentCard from '../components/CommentCard'

export default function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    // get post
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles(username, avatar_url),
        likes(user_id)
      `)
      .eq('id', id)
      .single()

    setPost({
      ...data,
      likes_count: data.likes.length
    })

    // get comments
    const commentsData = await getCommentsByPost(id)
    setComments(commentsData)
  }

  const handleComment = async () => {
    if (!text || !user) return

    const newComment = await createComment(text, id, user.id)

    setComments(prev => [...prev, newComment])
    setText('')
  }

  if (!post) return <p>Loading...</p>

  return (
    <div>
      <PostCard post={post} />

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