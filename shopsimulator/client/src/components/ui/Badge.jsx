export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-border-color text-text-secondary',
    active: 'bg-accent/15 text-accent border-accent/30',
    warning: 'bg-accent-warning/15 text-accent-warning border-accent-warning/30',
    error: 'bg-error/15 text-error border-error/30',
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-sm border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
