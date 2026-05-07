import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import { SkeletonTable } from '../../components/ui/Skeleton'

export default function UserOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/user/orders')
        setOrders(data)
      } catch (err) {
        setError('获取订单记录失败')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div>
        <h1 className="text-base font-semibold text-text-primary mb-3">My Orders</h1>
        <SkeletonTable rows={5} cols={5} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-text-primary mb-3">My Orders</h1>

      {error && <p className="text-xs text-error mb-3">{error}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary text-sm mb-3">No purchase records yet</p>
          <Link to="/" className="text-accent text-xs hover:underline">Go Shopping</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border-color">
                <th className="text-left py-2 px-2 text-text-secondary font-medium">ID</th>
                <th className="text-left py-2 px-2 text-text-secondary font-medium">Product</th>
                <th className="text-left py-2 px-2 text-text-secondary font-medium">Shop</th>
                <th className="text-right py-2 px-2 text-text-secondary font-medium font-mono">Price</th>
                <th className="text-left py-2 px-2 text-text-secondary font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className={`border-b border-border-color/50 ${i % 2 === 1 ? 'bg-bg-card/30' : ''}`}>
                  <td className="py-2 px-2 text-text-secondary">#{o.id}</td>
                  <td className="py-2 px-2 text-text-primary">{o.product?.productName}</td>
                  <td className="py-2 px-2 text-text-secondary">{o.shop?.shopName}</td>
                  <td className="py-2 px-2 text-right font-mono text-accent">
                    ¥{parseFloat(o.totalPrice).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-text-secondary">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
