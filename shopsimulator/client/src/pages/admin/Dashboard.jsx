import { useState, useEffect } from 'react'
import api from '../../api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { SkeletonTable } from '../../components/ui/Skeleton'

const roleLabels = { admin: 'Admin', merchant: 'Merchant', user: 'User' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchUser, setSearchUser] = useState('')
  const [filterRole, setFilterRole] = useState('')

  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({ username: '', role: '' })
  const [editing, setEditing] = useState(false)

  const [topUpModal, setTopUpModal] = useState(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [topUpping, setTopUpping] = useState(false)
  const [topUpError, setTopUpError] = useState('')

  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback({ type: '', message: '' }), 3000)
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (searchUser) params.search = searchUser
      if (filterRole) params.role = filterRole
      const { data } = await api.get('/admin/users', { params })
      setUsers(data)
    } catch (err) {
      showFeedback('error', '获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/orders')
      setOrders(data)
    } catch (err) {
      showFeedback('error', '获取订单列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'users') fetchUsers()
    else if (tab === 'orders') fetchOrders()
  }, [tab])

  const handleEdit = (user) => {
    setEditUser(user)
    setEditForm({ username: user.username, role: user.role })
  }

  const handleSaveEdit = async () => {
    setEditing(true)
    try {
      await api.put(`/admin/users/${editUser.id}`, editForm)
      showFeedback('success', '用户已更新')
      setEditUser(null)
      fetchUsers()
    } catch (err) {
      showFeedback('error', err.response?.data?.error || '更新失败')
    } finally {
      setEditing(false)
    }
  }

  const handleDeleteUser = async (user) => {
    if (user.role === 'admin') {
      showFeedback('error', '不能删除管理员账号')
      return
    }
    if (!confirm(`确定删除用户 ${user.username}?`)) return
    try {
      await api.delete(`/admin/users/${user.id}`)
      showFeedback('success', '用户已删除')
      fetchUsers()
    } catch (err) {
      showFeedback('error', err.response?.data?.error || '删除失败')
    }
  }

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) {
      setTopUpError('请输入有效金额')
      return
    }
    if (amount > 999999999) {
      setTopUpError('金额不能超过 999,999,999')
      return
    }
    setTopUpping(true)
    setTopUpError('')
    try {
      const { data } = await api.post('/admin/top-up', { userId: topUpModal.id, amount })
      showFeedback('success', data.message)
      setTopUpModal(null)
      setTopUpAmount('')
      fetchUsers()
    } catch (err) {
      setTopUpError(err.response?.data?.error || '充值失败')
    } finally {
      setTopUpping(false)
    }
  }

  const handleDeleteOrder = async (order) => {
    if (!confirm(`确定删除订单 #${order.id}?`)) return
    try {
      await api.delete(`/admin/orders/${order.id}`)
      showFeedback('success', '订单已删除')
      fetchOrders()
    } catch (err) {
      showFeedback('error', '删除失败')
    }
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-text-primary mb-3">Admin Panel</h1>

      {feedback.message && (
        <div className={`mb-3 p-2 border rounded text-xs ${
          feedback.type === 'success'
            ? 'border-accent/30 text-accent bg-accent/5'
            : 'border-error/30 text-error bg-error/5'
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="flex gap-1 mb-3 border-b border-border-color">
        {[
          { key: 'users', label: 'Users' },
          { key: 'orders', label: 'Orders' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-2 py-2 text-xs font-medium transition-all duration-150 border-b-2 -mb-px ${
              tab === t.key
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          <div className="flex gap-2 mb-3">
            <div className="flex-1 max-w-xs">
              <Input
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search username..."
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-5 px-2 bg-bg-card border border-border-color rounded text-xs text-text-primary"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="merchant">Merchant</option>
              <option value="user">User</option>
            </select>
            <Button variant="secondary" size="sm" onClick={fetchUsers}>Search</Button>
          </div>

          {loading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">ID</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Username</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Role</th>
                    <th className="text-right py-2 px-2 text-text-secondary font-medium font-mono">Balance</th>
                    <th className="text-right py-2 px-2 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={`border-b border-border-color/50 ${i % 2 === 1 ? 'bg-bg-card/30' : ''}`}>
                      <td className="py-2 px-2 text-text-secondary">{u.id}</td>
                      <td className="py-2 px-2 text-text-primary">{u.username}</td>
                      <td className="py-2 px-2">
                        <Badge variant={u.role === 'admin' ? 'warning' : u.role === 'merchant' ? 'active' : 'default'}>
                          {roleLabels[u.role] || u.role}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-accent">
                        ¥{parseFloat(u.balance).toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(u)}>Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setTopUpModal(u)
                          setTopUpAmount('')
                          setTopUpError('')
                        }}>Topup</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u)}>
                          <span className="text-accent-warning">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
            <div className="space-y-3">
              <Input
                label="用户名"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />
              <div>
                <label className="block text-xs text-text-secondary mb-1 font-medium">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full h-5 px-2 bg-bg-card border border-border-color rounded text-sm text-text-primary"
                >
                  <option value="admin">Admin</option>
                  <option value="merchant">Merchant</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setEditUser(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveEdit} disabled={editing}>
                  {editing ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal isOpen={!!topUpModal} onClose={() => setTopUpModal(null)} title={`Top Up — ${topUpModal?.username || ''}`}>
            <div className="space-y-3">
              <Input
                label="金额"
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                error={topUpError}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setTopUpModal(null)}>Cancel</Button>
                <Button size="sm" onClick={handleTopUp} disabled={topUpping}>
                  {topUpping ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}

      {tab === 'orders' && (
        <>
          {loading ? (
            <SkeletonTable rows={5} cols={6} />
          ) : orders.length === 0 ? (
            <p className="text-text-secondary text-xs text-center py-6">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">ID</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Buyer</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Product</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Shop</th>
                    <th className="text-right py-2 px-2 text-text-secondary font-medium font-mono">Price</th>
                    <th className="text-right py-2 px-2 text-text-secondary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} className={`border-b border-border-color/50 ${i % 2 === 1 ? 'bg-bg-card/30' : ''}`}>
                      <td className="py-2 px-2 text-text-secondary">{o.id}</td>
                      <td className="py-2 px-2 text-text-primary">{o.user?.username}</td>
                      <td className="py-2 px-2 text-text-primary">{o.product?.productName}</td>
                      <td className="py-2 px-2 text-text-secondary">{o.shop?.shopName}</td>
                      <td className="py-2 px-2 text-right font-mono text-accent">
                        ¥{parseFloat(o.totalPrice).toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(o)}>
                          <span className="text-accent-warning">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
