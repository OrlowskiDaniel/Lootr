import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import EditProfileModal from '../components/EditProfileModal'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { getProfileByUsername, getPostsByUser } from '../api/profile'

export default function ProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const load = async () => {
      const profileData = await getProfileByUsername(username)
      setProfile(profileData)

      if (profileData) {
        const postsData = await getPostsByUser(profileData.user_id)
        setPosts(postsData)
      }
    }

    load()
  }, [username])

  if (!profile) return <p className="p-4">Loading...</p>

  const isOwner = user?.id === profile.user_id

  return (
    <div>
      {/* Banner */}
      <div className="h-32 w-full bg-gradient-to-r from-purple-900 to-black" />

      {/* Profile header */}
      <div className="px-4 -mt-12">
        <div className="flex justify-between items-start">
          <Avatar user={profile} size="xl" />

          {isOwner && (
            <button
              className="btn-ghost px-4 py-1 mt-4"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        <h2 className="font-heading text-2xl mt-2">
          {profile.username}
        </h2>

        <p style={{ color: 'var(--text-muted)' }}>
          {profile.description}
        </p>

        {/* stats (fake for now) */}
        <div className="flex gap-4 mt-3 text-sm">
          <span><b>{posts.length}</b> Posts</span>
          <span><b>0</b> Followers</span>
        </div>
      </div>

      {/* divider */}
      <div className="neon-line my-4" />

      {/* posts */}
      <div>
        {posts.length === 0 ? (
          <EmptyState title="No posts yet" />
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* modal */}
      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSaved={setProfile}
        />
      )}
    </div>
  )
}