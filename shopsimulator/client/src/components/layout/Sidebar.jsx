import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const roleLabels = { admin: 'Admin', merchant: 'Merchant', user: 'User' }

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
]

const merchantLinks = [
  { to: '/merchant', label: 'Dashboard' },
]

const userLinks = [
  { to: '/', label: 'Shops' },
  { to: '/user/orders', label: 'Orders' },
  { to: '/user/balance', label: 'Balance' },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const [collapsed, setCollapsed] = useState(false)

  const links = user?.role === 'admin'
    ? adminLinks
    : user?.role === 'merchant'
      ? merchantLinks
      : userLinks

  return (
    <aside
      className={`
        bg-bg-card border-r border-border-color flex flex-col h-screen
        transition-all duration-150
        ${collapsed ? 'w-12' : 'w-48'}
      `}
    >
      <div className="flex items-center justify-between p-2 border-b border-border-color h-6">
        {!collapsed && (
          <Link to="/" className="font-mono text-accent text-sm font-semibold tracking-wide">
            SS
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-text-secondary hover:text-accent transition-colors duration-150 text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex-1 py-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-2 px-2 py-2 text-xs text-text-secondary hover:text-accent hover:bg-accent/5 transition-all duration-150"
          >
            <span className="text-xs">•</span>
            {!collapsed && <span>{link.label}</span>}
          </Link>
        ))}
      </nav>

      {!collapsed && user && (
        <div className="p-2 border-t border-border-color">
          <p className="text-xs text-text-secondary">
            <span className="text-accent">{user.username}</span>
          </p>
          <p className="text-xs text-text-secondary/60">
            {roleLabels[user.role] || user.role}
          </p>
        </div>
      )}
    </aside>
  )
}
