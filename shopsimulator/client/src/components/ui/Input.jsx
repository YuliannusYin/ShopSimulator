export default function Input({ label, type = 'text', placeholder, value, onChange, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-text-secondary mb-1 font-medium tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-5 px-2 bg-bg-card border rounded text-sm text-text-primary font-mono
          placeholder:text-text-secondary/50
          transition-all duration-150 ease-out
          focus:outline-none focus:border-accent
          ${error ? 'border-error' : 'border-border-color'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
}
