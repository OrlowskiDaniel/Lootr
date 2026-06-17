import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gamepad2, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { signIn, signUp } from '../api/auth'

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', username: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'login') {
        await signIn(form.email, form.password)
        navigate('/')
      } else {
        const data = await signUp(form.email, form.password, form.username)

        // If email confirmation is ON, data.user exists but data.session is null.
        // If confirmation is OFF, both exist and we can go straight to the app.
        if (data.session) {
          navigate('/')
        } else {
          // Email confirmation required — tell the user and stop the spinner
          setForm({ email: '', password: '', username: '' })
          setMessage('Account created! Check your email to confirm your account, then sign in.')
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--purple)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl"
          style={{ background: 'var(--dark-purple)' }} />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(var(--purple) 1px, transparent 1px), linear-gradient(90deg, var(--purple) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <img src="Lootr-logo.png" alt="Lootr Logo" className="" />
        <div className="text-center mb-8">
          <div className="flex items-center justify-center !gap-3 !mb-3">
            <div className="relative">
              <Gamepad2 size={40} style={{ color: 'var(--light-purple)' }} />
              <div className="absolute inset-0 blur-lg opacity-60"
                style={{ background: 'var(--light-purple)' }} />
            </div>
            <span className="font-display font-black text-5xl tracking-widest glow-text"
              style={{ color: 'var(--light-purple)' }}>
              LOOTR
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            The social hub for gamers
          </p>
        </div>

        <div className="lootr-card rounded-2xl !p-6 glow-border">
          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden border mb-6"
            style={{ borderColor: 'var(--border)' }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null) }}
                className="flex-1 !py-2.5 text-sm font-bold transition-all cursor-pointer"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  letterSpacing: '0.08em',
                  background: mode === m ? 'linear-gradient(135deg, var(--purple), var(--dark-purple))' : 'transparent',
                  color: mode === m ? 'var(--white)' : 'var(--text-muted)',
                }}>
                {m === 'login' ? 'SIGN IN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 text-xs !p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-mono">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 text-xs !p-3 rounded bg-green-500/10 border border-green-500/30 text-green-400 font-mono">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="!mb-4">
                <label className="block font-heading font-semibold text-xs tracking-wider !mb-1.5"
                  style={{ color: 'var(--silver)' }}>
                  GAMERTAG
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={handleField('username')}
                  placeholder="YourGamingName"
                  className="lootr-input w-full !px-4 !py-3 rounded-lg"
                />
              </div>
            )}

            <div className="!mb-4">
              <label className="block font-heading font-semibold text-xs tracking-wider !mb-1.5"
                style={{ color: 'var(--silver)' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleField('email')}
                placeholder="gamer@example.com"
                className="lootr-input w-full !px-4 !py-3 rounded-lg"
              />
            </div>

            <div className='!mb-6'>
              <label className="block font-heading font-semibold text-xs tracking-wider !mb-1.5"
                style={{ color: 'var(--silver)' }}>
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleField('password')}
                  placeholder="••••••••"
                  className="lootr-input w-full !px-4 !py-3 rounded-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 !p-1 cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 !py-3 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="font-heading font-bold tracking-widest text-sm">LOADING...</span>
              ) : (
                <>
                  <span className="font-heading font-bold tracking-widest text-sm">
                    {mode === 'login' ? 'ENTER THE GAME' : 'JOIN LOOTR'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center gap-3 !mb-5 !mt-5">
              <div className="flex-1 neon-line" />
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>OR</span>
              <div className="flex-1 neon-line" />
            </div>

            <button
              type="button"
              className="btn-ghost w-full flex items-center justify-center gap-2.5 !py-3 rounded-lg cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#5865F2' }}>
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span className="font-heading font-bold tracking-wide text-sm">Continue with Discord</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6 font-mono" style={{ color: 'var(--text-muted)' }}>
          By signing up you agree to the{' '}
          <a href="#" className="hover:underline" style={{ color: 'var(--light-purple)' }}>Terms</a>
          {' & '}
          <a href="#" className="hover:underline" style={{ color: 'var(--light-purple)' }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}