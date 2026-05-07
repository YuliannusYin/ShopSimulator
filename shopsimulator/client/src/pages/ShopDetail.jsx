import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { useAuthStore } from '../stores/authStore'

export default function ShopDetail() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(null)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [shopRes, prodRes] = await Promise.all([
        api.get(`/shops/${id}`),
        api.get(`/products?shopId=${id}`),
      ])
      setShop(shopRes.data)
      setProducts(prodRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleBuy = async (product) => {
    setBuying(product.id)
    setFeedback({ type: '', message: '' })
    try {
      const { data } = await api.post('/orders', { productId: product.id, quantity: 1 })
      setFeedback({ type: 'success', message: data.message || 'Purchase successful!' })
      useAuthStore.getState().setAuth(useAuthStore.getState().token, data.user)
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || 'Purchase failed' })
    } finally {
      setBuying(null)
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
        <div className="space-y-2 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-card border border-border-color rounded p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">Shop not found</p>
        <Link to="/" className="text-accent text-xs mt-2 inline-block">← Back to shops</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="text-xs text-text-secondary hover:text-accent transition-colors duration-150 mb-2 inline-block">
        ← Back to shops
      </Link>

      <div className="mb-3">
        <h1 className="text-base font-semibold text-text-primary">{shop.shopName}</h1>
        {shop.description && (
          <p className="text-xs text-text-secondary mt-1">{shop.description}</p>
        )}
        <p className="text-xs text-text-secondary/60 mt-1">
          Merchant: {shop.merchant?.username}
        </p>
      </div>

      {feedback.message && (
        <div className={`mb-3 p-2 border rounded text-xs ${
          feedback.type === 'success'
            ? 'border-accent/30 text-accent bg-accent/5'
            : 'border-error/30 text-error bg-error/5'
        }`}>
          {feedback.message}
        </div>
      )}

      <div className="space-y-1">
        {products.length === 0 ? (
          <p className="text-text-secondary text-xs py-4 text-center">No products available</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-bg-card border border-border-color rounded p-3 flex items-center justify-between hover:border-accent/30 transition-all duration-150"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text-primary">{product.productName}</h3>
                {product.description && (
                  <p className="text-xs text-text-secondary mt-1 line-clamp-1">{product.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-accent font-semibold">
                    ¥{parseFloat(product.price).toLocaleString()}
                  </span>
                  {product.status !== 'active' && (
                    <Badge variant="warning">{product.status}</Badge>
                  )}
                </div>
              </div>
              {user?.role === 'user' && (
                <Button
                  size="sm"
                  onClick={() => handleBuy(product)}
                  disabled={buying === product.id || parseFloat(user.balance) < parseFloat(product.price)}
                >
                  {buying === product.id ? '...' : '+'}
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
