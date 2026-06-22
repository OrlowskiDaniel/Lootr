import { Gamepad2 } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', message = 'Be the first to post!', icon: Icon = Gamepad2 }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="mb-4 p-4 rounded-full" style={{ background: 'rgba(123,47,190,0.15)' }}>
        <Icon size={32} style={{ color: 'var(--purple)' }} />
      </div>
      <h3 className="font-heading font-bold text-xl mb-2" style={{ color: 'var(--white)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{message}</p>
    </div>
  )
}
