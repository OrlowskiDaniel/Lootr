export default function Avatar({ user, size = 'md', className = '' }) {
  const sizes = {
    sm:   'w-8 h-8 text-sm',
    md:   'w-11 h-11 text-lg',
    lg:   'w-16 h-16 text-2xl',
    xl:   'w-24 h-24 text-4xl',
  }

  // Deterministic hue from username
  const hue = user?.username
    ? (user.username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 7) % 360
    : 270

  return (
    <div
      className={`avatar-ring rounded-full flex items-center justify-center flex-shrink-0 ${sizes[size]} ${className}`}
      style={{ background: `hsl(${hue}, 50%, 18%)` }}
    >
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="font-heading font-bold" style={{ color: 'var(--light-purple)' }}>
          {user?.username?.[0]?.toUpperCase() ?? '?'}
        </span>
      )}
    </div>
  )
}
