import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuthStore } from '../stores/authStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', role: 'user' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = '请输入用户名'
    else if (form.username.trim().length < 3) errs.username = '用户名至少 3 个字符'
    if (!form.password) errs.password = '请输入密码'
    else if (form.password.length < 6) errs.password = '密码至少 6 个字符'
    if (form.password !== form.confirmPassword) errs.confirmPassword = '两次密码不一致'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        role: form.role,
      })
      setAuth(data.token, data.user)
      const paths = { merchant: '/merchant', user: '/' }
      navigate(paths[data.user.role] || '/')
    } catch (err) {
      setServerError(err.response?.data?.error || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-3">
      <div className="w-full max-w-sm">
        <div className="mb-5 text-center">
          <h1 className="font-mono text-accent text-xl font-semibold tracking-wide">ShopSimulator</h1>
          <p className="text-text-secondary text-xs mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-card border border-border-color rounded p-4 space-y-3">
          <Input
            label="用户名"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="At least 3 characters"
            error={errors.username}
          />
          <Input
            label="密码"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
            error={errors.password}
          />
          <Input
            label="确认密码"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
          />
          <div>
            <label className="block text-xs text-text-secondary mb-1 font-medium tracking-wide uppercase">
              角色
            </label>
            <div className="flex gap-2">
              {[
                { value: 'user', label: 'Buyer' },
                { value: 'merchant', label: 'Merchant' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: opt.value })}
                  className={`
                    flex-1 h-5 border rounded text-xs font-medium transition-all duration-150
                    ${form.role === opt.value
                      ? 'border-accent text-accent bg-accent/5'
                      : 'border-border-color text-text-secondary hover:border-text-secondary'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {serverError && (
            <p className="text-xs text-error">{serverError}</p>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-text-secondary text-xs mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
