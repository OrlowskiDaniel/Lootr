import { useState } from 'react'
import { upsertProfile } from '../api/profile'
import { uploadAvatar } from '../api/storage'
import { useAuth } from '../hooks/useAuth'

export default function EditProfileModal({ profile, onClose, onSaved }) {
  const { user } = useAuth()

  const [username, setUsername] = useState(profile?.username || '')
  const [description, setDescription] = useState(profile?.description || '')
  const [file, setFile] = useState(null)

  const handleSave = async () => {
    let avatarUrl = profile?.avatar_url

    if (file) {
      avatarUrl = await uploadAvatar(file, user.id)
    }

    const updated = await upsertProfile({
      id: profile?.id,
      user_id: user.id,
      username,
      description,
      avatar_url: avatarUrl
    })

    onSaved(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="lootr-card !p-6 w-full max-w-md rounded-lg relative">
        <h2 className="font-heading text-xl !mb-4">Edit Profile</h2>

        <input
            className="lootr-input w-full !p-2 !mb-3 rounded"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
        />

        <textarea
            className="lootr-input w-full !p-2 !mb-3 rounded"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
        />

        <p className="text-xs text-gray-400 group-hover:text-gray-200">
          Click to upload an avatar
        </p>
        <input type="file" className='' onChange={e => setFile(e.target.files[0])} />

        <div className="flex justify-end !gap-2 !mt-4">
            <button className="btn-ghost !px-3 !py-1" onClick={onClose}>
            Cancel
            </button>
            <button className="btn-primary !px-3 p!y-1" onClick={handleSave}>
            Save
            </button>
        </div>
        </div>
    </div>
    )
}