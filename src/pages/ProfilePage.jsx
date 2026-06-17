import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Avatar from '../components/Avatar'
import EditProfileModal from '../components/EditProfileModal'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { getProfileByUsername, getPostsByUser, getFollowersCount } from '../api/profile'
import { toggleFollow, checkIfFollowing } from '../api/follows'
import { toggleLike } from '../api/likes'

export default function ProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(false)

  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)

  const likePost = async (postId) => {
    if (!user) return

    const res = await toggleLike(postId, user.id)

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              likes_count: res.liked
                ? p.likes_count + 1
                : p.likes_count - 1,
              liked_by_user: res.liked
            }
          : p
      )
    )
  }

  useEffect(() => {
    if (!username) return

    const load = async () => {
      const profileData = await getProfileByUsername(username)

      if (profileData) {
        setProfile(profileData)

        const count = await getFollowersCount(profileData.user_id)
        setFollowersCount(count)

        if (user) {
          const following = await checkIfFollowing(profileData.user_id, user.id)
          setIsFollowing(following)
        }

        const postsData = await getPostsByUser(profileData.user_id)
        setPosts(postsData)
      }
    }

    load()
  }, [username, user]) 

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

          {!isOwner && (
            <button
                className="btn-primary px-4 py-1 mt-4"
                onClick={async () => {
                  if (!user) return // Guard clause if user isn't logged in

                  const res = await toggleFollow(profile.user_id, user.id)
                  setIsFollowing(res.following)
                  
                  // Dynamically increment or decrement the UI counter
                  setFollowersCount(prev => res.following ? prev + 1 : prev - 1)
                }}
            >
                {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            )}

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
          <span><b>{followersCount}</b> Followers</span>
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
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={likePost} 
            />
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