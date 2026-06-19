import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gamepad2, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { signIn, signUp, signInWithGoogle } from '../api/auth'

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

  const handleGoogle = async () => {
    try {
      setError(null)
      await signInWithGoogle()
      // No navigate() here — Supabase redirects the browser automatically
    } catch (err) {
      setError(err.message || 'Google sign-in failed.')
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
              onClick={handleGoogle}
              className="btn-ghost w-full flex items-center justify-center gap-2.5 !py-3 rounded-lg cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-heading font-bold tracking-wide text-sm">Continue with Google</span>
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