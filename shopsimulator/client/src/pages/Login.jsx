import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuthStore } from '../stores/authStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = '请输入用户名'
    if (!form.password) errs.password = '请输入密码'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.token, data.user)
      const paths = { admin: '/admin', merchant: '/merchant', user: '/' }
      navigate(paths[data.user.role] || '/')
    } catch (err) {
      setServerError(err.response?.data?.error || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        <div className="mb-5 text-center">
          <h1 className="font-mono text-accent text-xl font-semibold tracking-wide">ShopSimulator</h1>
          <p className="text-text-secondary text-xs mt-1">模拟购物 · 极简体验</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-border-color rounded p-4 space-y-3">
          <Input
            label="用户名"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Enter username"
            error={errors.username}
          />
          <Input
            label="密码"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter password"
            error={errors.password}
          />
          {serverError && (
            <p className="text-xs text-error">{serverError}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-xs mt-2">
          No account?{' '}
          <Link to="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
