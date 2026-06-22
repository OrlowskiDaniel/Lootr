import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function PostCard({ post, onLike, onDelete }) {
  if (!post || !post.user) return null

  const { user } = post
  const [currentUser, setCurrentUser] = React.useState(null)
  
  // SHeet stap: Lokale states voor de geselecteerde afbeelding en de uiteindelijke URL
  const [image, setImage] = React.useState(null)
  const [imageUrl, setImageUrl] = React.useState(post.image_url)

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user))
  }, [])

  // De async upload functie die pas afgaat bij de 'submit' (Stap 2 uit de sheets)
  const handleUploadSubmit = async (e) => {
    e.preventDefault() // Voorkom pagina herladen
    if (!image || !currentUser) return

    try {
      const filename = `${currentUser.id}-${Date.now()}`
      
      // 1. Upload het bestand uit de 'image' state naar de storage bucket
      await supabase.storage.from('post-images').upload(filename, image)

      // 2. Verkrijg de publieke URL
      const { data } = supabase.storage.from('post-images').getPublicUrl(filename)

      // 3. Update de database en zet de nieuwe URL in de weergave
      await supabase.from('posts').update({ image_url: data.publicUrl }).eq('id', post.id)
      
      setImageUrl(data.publicUrl)
      setImage(null) // Reset de geselecteerde afbeelding status
    } catch (err) {
      console.error(err.message)
    }
  }

  // Tijdsaanduiding berekening
  const diff = (Date.now() - new Date(post.created_at)) / 1000
  const timeDisplay = diff < 60 ? `${Math.floor(diff)}s` : diff < 3600 ? `${Math.floor(diff / 60)}m` : diff < 86400 ? `${Math.floor(diff / 3600)}h` : `${Math.floor(diff / 86400)}d`

  return (
    <article className="border-b px-4 py-4 border-[var(--border)]">
      <div className="flex gap-3">
        
        {/* Avatar */}
        <Link to={`/profile/${user.username}`}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--dark-purple)] text-[var(--light-purple)] font-heading font-bold text-lg overflow-hidden">
            {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : (user.username?.[0]?.toUpperCase() ?? '?')}
          </div>
        </Link>

        {/* Post Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Link to={`/profile/${user.username}`} className="font-heading font-bold text-[var(--white)]">
              {user.username}
            </Link>
            <span className="font-mono text-xs text-[var(--text-muted)]">@{user.username} · {timeDisplay}</span>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-primary)]">{post.content}</p>

          {/* Toon de foto als deze bestaat in de database of zojuist is toegevoegd */}
          {imageUrl && <img src={imageUrl} alt="Post" className="mt-3 rounded-lg max-h-96 w-full object-cover" />}

          {/* Interactie balk (Like) */}
          <div className="mt-3 flex flex-col gap-2">
            <button onClick={() => onLike?.(post.id)} className={`flex items-center gap-2 text-xs self-start ${post.liked_by_user ? 'text-pink-500' : 'text-[var(--text-muted)]'}`}>
              <Heart size={16} fill={post.liked_by_user ? '#ec4899' : 'none'} />
              {post.likes_count ?? 0}
            </button>

            
            {currentUser?.id === post.user_id && (
              <div className="mt-2 pt-2 border-t border-dashed border-gray-800 text-xs flex flex-col gap-3">
                
                <div className="flex items-center gap-4">
                  <button onClick={() => onDelete?.(post.id)} className="text-red-500 hover:underline">Delete</button>
                  
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    className="text-gray-400"
                  />
                </div>

               
                {image && (
                  <form onSubmit={handleUploadSubmit} className="bg-gray-900 p-2 rounded flex items-center justify-between gap-2">
                    <span className="text-gray-300 font-mono text-[11px] truncate max-w-[200px]">
                      Geselecteerd: {image.name}
                    </span>
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-bold">
                      Foto uploaden
                    </button>
                  </form>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </article>
  )
}