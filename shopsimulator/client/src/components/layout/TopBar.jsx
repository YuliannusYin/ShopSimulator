import { useAuthStore } from '../../stores/authStore'

export default function TopBar() {
  const { user, logout } = useAuthStore()

  const toggleTheme = () => {
    const html = document.documentElement
    const current = html.classList.contains('dark') ? 'dark' : 'light'
    if (current === 'dark') {
      html.classList.remove('dark')
      html.classList.add('light')
      localStorage.setItem('shopsimulator_theme', 'light')
    } else {
      html.classList.remove('light')
      html.classList.add('dark')
      localStorage.setItem('shopsimulator_theme', 'dark')
    }
  }

  return (
    <header className="h-6 bg-bg-card border-b border-border-color flex items-center justify-between px-3">
      <div />
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="text-text-secondary hover:text-accent transition-colors duration-150 text-xs font-mono"
          title="切换主题"
        >
          ☀/☾
        </button>
        {user && (
          <>
            <span className="text-xs text-text-secondary font-mono">
              ￥{parseFloat(user.balance || 0).toLocaleString()}
            </span>
            <button
              onClick={logout}
              className="text-xs text-text-secondary hover:text-accent-warning transition-colors duration-150"
            >
              logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}
