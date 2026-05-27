export default function Spinner({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className}`}
    >
      <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="var(--light-purple)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px var(--light-purple))' }}
      />
    </svg>
  )
}
