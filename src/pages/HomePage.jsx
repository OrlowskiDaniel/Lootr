import { useState } from 'react'
import { Zap } from 'lucide-react'
import ComposePost from '../components/ComposePost'
import FeedTabs from '../components/FeedTabs'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'


export default function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you')
  const { user } = useAuth()
  // const { posts, loading, likePost } = usePosts(activeTab)

  const createPost = async (content) => {
    if (!content || !user) return

    const { error } = await supabase
      .from('posts')
      .insert([
        {
          content,
          user_id: user.id,
        },
      ])

    if (error) {
      console.error('Error creating post:', error.message)
    }
  }


  const fetchPosts = async () => {
    const {data, error} = await supabase
    .from(".posts")
    .select("*")
    .order("created_at", { ascending: false });

    if (!error) setposts(data); 

    useEffect(() => {
      fetchPosts();
    })

    const handlesubmit = async (e) => {
      e.preventDefault();

      const error = await supabase.from("posts").insert({
        session_id: session.sub,
        content: content,
      });

      if (!error) setcontent("");

      fetchPosts();
    }
    
      {post.map ((post) => (
        <PostCard 
        key={post.id} 
        user={post.user_id}
        content={post.content}
        date={post.created_at}
          />
      )) 
      }
      }



  return (
    <>
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ borderColor: 'var(--border)', background: 'rgba(13,13,13,0.85)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap size={18} style={{ color: 'var(--light-purple)' }} />
            <h1 className="font-heading font-bold text-lg tracking-wide" style={{ color: 'var(--white)' }}>
              Home
            </h1>
          </div>
        </div>
        <FeedTabs active={activeTab} onChange={setActiveTab} />
      </header>

      {/* Compose */}
      <ComposePost onPost={createPost} />

      
      {/* Feed */}
      {/* {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size={32} />
        </div>
      ) : posts.length === 0 ? ( */}
        <EmptyState
          title="No posts yet"
          message="Follow some players or post your first loot!"
        />
      {/* ) : (
        <div>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={likePost} />
          ))}
        </div>
      )} */}
      
    </>
  )
}
