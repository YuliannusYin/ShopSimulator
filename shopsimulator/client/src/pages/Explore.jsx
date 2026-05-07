import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { useAuthStore } from '../stores/authStore'

export default function Explore() {
  const user = useAuthStore((s) => s.user)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(null)
  const [toast, setToast] = useState('')

  const fetchRandom = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/products/random?count=12')
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRandom()
  }, [fetchRandom])

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2000)
  }

  const handleQuickBuy = async (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    if (parseFloat(user.balance) < parseFloat(product.price)) {
      showToast('余额不足')
      return
    }
    setBuying(product.id)
    try {
      const { data } = await api.post('/orders', { productId: product.id, quantity: 1 })
      useAuthStore.getState().setAuth(useAuthStore.getState().token, data.user)
      showToast('已购买')
    } catch (err) {
      showToast(err.response?.data?.error || '购买失败')
    } finally {
      setBuying(null)
    }
  }

  const isUser = user?.role === 'user'

  return (
    <div>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-bg-card border border-accent rounded text-xs text-accent font-mono shadow-none">
          {toast}
        </div>
      )}

      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-text-primary tracking-wide">逛商场</h1>
        <p className="text-xs text-text-secondary mt-1">Explore random finds</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <Button variant="secondary" size="md" onClick={fetchRandom} disabled={loading}>
          {loading ? 'Refreshing...' : '换一批'}
        </Button>
        {!loading && (
          <span className="text-xs text-text-secondary font-mono">
            {products.length} items
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-color rounded p-2">
              <Skeleton className="w-full aspect-[4/3] rounded-sm mb-2" />
              <Skeleton className="h-3 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/3 ml-auto" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-bg-card border border-border-color rounded p-2 group relative hover:border-accent hover:scale-[1.02] transition-all duration-150 ease-out"
            >
              {isUser && (
                <button
                  onClick={(e) => handleQuickBuy(e, product)}
                  disabled={buying === product.id || product.status !== 'active'}
                  className="absolute top-2 right-2 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-bg-primary/80 border border-border-color text-accent text-sm hover:bg-accent hover:text-black transition-all duration-150 ease-out disabled:opacity-40"
                >
                  {buying === product.id ? '·' : '+'}
                </button>
              )}

              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full aspect-[4/3] object-cover rounded-sm bg-bg-primary mb-2"
                />
              ) : (
                <div className="w-full aspect-[4/3] rounded-sm bg-bg-primary flex items-center justify-center mb-2">
                  <span className="text-text-secondary text-xs font-mono">Img</span>
                </div>
              )}

              <h3 className="text-xs font-medium text-text-primary line-clamp-1 mb-1">
                {product.productName}
              </h3>

              <p className="text-xs font-mono text-accent font-semibold text-right">
                ¥{parseFloat(product.price).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
