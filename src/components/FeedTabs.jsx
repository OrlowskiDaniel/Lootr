const TABS = [
  { id: 'for-you', label: 'For You' },
  { id: 'following', label: 'Following' },
]

export default function FeedTabs({ active, onChange }) {
  return (
    <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 py-3.5 text-sm font-semibold relative transition-colors cursor-pointer"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            letterSpacing: '0.04em',
            color: active === tab.id ? 'var(--light-purple)' : 'var(--text-muted)',
          }}
        >
          {tab.label}
          {active === tab.id && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
              style={{
                width: '60%',
                background: 'var(--light-purple)',
                boxShadow: '0 0 8px var(--light-purple)',
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
