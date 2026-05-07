import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Skeleton from '../components/ui/Skeleton'
import { useAuthStore } from '../stores/authStore'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [buyModal, setBuyModal] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const [quantityError, setQuantityError] = useState('')
  const [buying, setBuying] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/products/${id}`)
        setProduct(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const openBuyModal = () => {
    setQuantity('1')
    setQuantityError('')
    setFeedback({ type: '', message: '' })
    setBuyModal(true)
  }

  const handleBuy = async () => {
    const qty = parseInt(quantity)
    if (isNaN(qty) || qty < 1) {
      setQuantityError('数量至少为 1')
      return
    }
    if (qty > 999) {
      setQuantityError('数量不能超过 999')
      return
    }
    const totalCost = parseFloat(product.price) * qty
    if (parseFloat(user.balance) < totalCost) {
      setQuantityError('余额不足')
      return
    }

    setBuying(true)
    setQuantityError('')
    try {
      const { data } = await api.post('/orders', { productId: product.id, quantity: qty })
      useAuthStore.getState().setAuth(useAuthStore.getState().token, data.user)
      setBuyModal(false)
      navigate('/user/orders')
    } catch (err) {
      setFeedback({ type: 'error', message: err.response?.data?.error || '购买失败' })
    } finally {
      setBuying(false)
    }
  }

  const isOwnProduct = user?.id === product?.shop?.merchantId
  const isAdmin = user?.role === 'admin'

  if (loading) {
    return (
      <div>
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="w-full aspect-video rounded mb-3" />
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48 mb-3" />
        <div className="bg-bg-card border border-border-color rounded p-3">
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">Product not found</p>
        <Link to="/" className="text-accent text-xs mt-2 inline-block">← Back to shops</Link>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1">
        <Link
          to={`/shop/${product.shopId}`}
          className="text-xs text-text-secondary hover:text-accent transition-colors duration-150 mb-2 inline-block"
        >
          ← Back
        </Link>

        {feedback.message && (
          <div className={`mb-3 p-2 border rounded text-xs ${
            feedback.type === 'success'
              ? 'border-accent/30 text-accent bg-accent/5'
              : 'border-error/30 text-error bg-error/5'
          }`}>
            {feedback.message}
          </div>
        )}

        <div className="mb-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full aspect-video object-cover rounded bg-bg-card border border-border-color"
            />
          ) : (
            <div className="w-full aspect-video rounded bg-bg-card border border-border-color flex items-center justify-center">
              <span className="text-text-secondary text-sm font-mono">No Image</span>
            </div>
          )}
        </div>

        <h1 className="text-xl font-semibold text-text-primary mb-1">{product.productName}</h1>

        <p className="text-2xl font-mono text-accent font-semibold mb-1">
          ¥{parseFloat(product.price).toLocaleString()}
        </p>

        <Link
          to={`/shop/${product.shopId}`}
          className="text-sm text-text-secondary hover:text-accent transition-colors duration-150 mb-3 inline-block"
        >
          {product.shop?.shopName}
        </Link>

        {product.description && (
          <div className="bg-bg-card border border-border-color rounded p-3 mb-4">
            <p className="text-xs text-text-primary/80 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 -mx-3 -mb-3 px-3 py-3 bg-bg-primary/95 border-t border-border-color">
        <div className="max-w-2xl mx-auto">
          {user?.role === 'user' ? (
            <div className="flex items-center justify-between gap-3">
              <div className="text-text-secondary text-sm">
                余额 <span className="font-mono text-accent">¥{parseFloat(user.balance || 0).toLocaleString()}</span>
              </div>
              <Button
                size="lg"
                onClick={openBuyModal}
                disabled={isOwnProduct || product.status !== 'active'}
                className="flex-1 max-w-xs"
              >
                {isOwnProduct ? 'Own Product' : product.status !== 'active' ? 'Unavailable' : 'Buy Now'}
              </Button>
            </div>
          ) : isAdmin ? (
            <p className="text-text-secondary text-sm text-center">Admin Preview Mode</p>
          ) : null}
        </div>
      </div>

      <Modal isOpen={buyModal} onClose={() => setBuyModal(false)} title="Confirm Purchase">
        <div className="space-y-3">
          <div className="bg-bg-primary/50 rounded p-2 space-y-1">
            <p className="text-sm text-text-primary">{product.productName}</p>
            <p className="text-xs text-text-secondary">
              单价: <span className="font-mono text-accent">¥{parseFloat(product.price).toLocaleString()}</span>
            </p>
            {quantity && parseInt(quantity) > 0 && (
              <p className="text-xs text-text-secondary">
                合计: <span className="font-mono text-accent font-semibold">
                  ¥{(parseFloat(product.price) * parseInt(quantity || 0)).toLocaleString()}
                </span>
              </p>
            )}
          </div>
          <Input
            label="数量"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
            error={quantityError}
            min="1"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setBuyModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleBuy} disabled={buying}>
              {buying ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
