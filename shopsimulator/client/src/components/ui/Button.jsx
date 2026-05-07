export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button', className = '' }) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-40 disabled:cursor-not-allowed select-none'

  const variants = {
    primary: 'bg-accent text-black hover:brightness-110 active:brightness-90',
    secondary: 'bg-transparent border border-border-color text-text-primary hover:border-accent hover:text-accent active:border-accent',
    danger: 'bg-transparent border border-accent-warning text-accent-warning hover:bg-accent-warning hover:text-white active:brightness-90',
    ghost: 'bg-transparent text-text-secondary hover:text-accent active:text-accent',
  }

  const sizes = {
    sm: 'h-4 px-2 text-xs rounded-sm',
    md: 'h-5 px-3 text-sm rounded',
    lg: 'h-6 px-4 text-base rounded',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
