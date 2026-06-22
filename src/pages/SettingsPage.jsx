import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateProfilePrivacy } from '../api/profile'
import { Shield, ShieldAlert, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Sync state when profile loads
  useEffect(() => {
    if (profile) {
      setIsPrivate(!!profile.is_private)
    }
  }, [profile])

  if (!user) {
    return (
      <div className="!p-6 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Please sign in to access your settings.</p>
      </div>
    )
  }

  const handlePrivacyToggle = async (e) => {
    const newValue = e.target.checked
    
    // Update the toggle switch UI and start loading
    setIsPrivate(newValue)
    setLoading(true)
    setMessage('')

    try {
      // Send the new value to the database
      await updateProfilePrivacy(user.id, newValue)
      setMessage('Privacy settings updated successfully!')
    } catch (error) {
      // Show an error
      setMessage('Failed to update settings. Please try again.')
    } finally {
      // Stop spinner
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto !p-6">
      <h1 className="font-heading text-3xl font-bold tracking-wide !mb-2" style={{ color: 'var(--white)' }}>
        Settings
      </h1>
      <p className="text-sm !mb-6" style={{ color: 'var(--text-muted)' }}>
        Manage your account settings and privacy preferences.
      </p>

      <div className="neon-line !mb-6" />

      {/* Privacy Section Box */}
      <div 
        className="!p-5 rounded-xl border flex flex-col !gap-4"
        style={{ background: 'rgba(123,47,190,0.03)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="!mt-1 text-purple-400">
              {isPrivate ? <Shield size={22} className="text-purple-500" style={{ filter: 'drop-shadow(0 0 4px var(--light-purple))' }} /> : <ShieldAlert size={22} />}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base" style={{ color: 'var(--white)' }}>
                Private Account
              </h3>
              <p className="text-sm !mt-1" style={{ color: 'var(--text-muted)' }}>
                When your account is private, only users who follow you can see your full profile and posts.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer !mt-1 select-none">
            <input 
              type="checkbox" 
              checked={isPrivate} 
              onChange={handlePrivacyToggle}
              disabled={loading}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Status updates */}
        {loading && (
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--light-purple)' }}>
            <Loader2 size={14} className="animate-spin" />
            <span>Saving changes...</span>
          </div>
        )}

        {message && !loading && (
          <p className="text-xs font-mono" style={{ color: message.includes('failed') ? '#ef4444' : 'var(--light-purple)' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}