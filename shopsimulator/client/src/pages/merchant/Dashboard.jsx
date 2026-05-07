import { useState, useEffect } from 'react'
import api from '../../api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import { SkeletonTable, SkeletonCard } from '../../components/ui/Skeleton'

function ProductImagePreview({ url }) {
  const [error, setError] = useState(false)

  if (!url || error) {
    return (
      <span className="text-text-secondary text-xs font-mono">Img</span>
    )
  }

  return (
    <img
      src={url}
      alt="preview"
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  )
}

export default function MerchantDashboard() {
  const [tab, setTab] = useState('products')
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const [productModal, setProductModal] = useState(null)
  const [productForm, setProductForm] = useState({ productName: '', description: '', price: '', imageUrl: '' })
  const [productErrors, setProductErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [shopModal, setShopModal] = useState(null)
  const [shopForm, setShopForm] = useState({ shopName: '', description: '' })
  const [shopErrors, setShopErrors] = useState({})
  const [shopSaving, setShopSaving] = useState(false)

  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const showFeedback = (type, message) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback({ type: '', message: '' }), 3000)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [shopRes, prodRes, orderRes] = await Promise.all([
        api.get('/merchant/shop'),
        api.get('/merchant/products'),
        api.get('/merchant/orders'),
      ])
      setShop(shopRes.data)
      setProducts(prodRes.data)
      setOrders(orderRes.data)
    } catch (err) {
      showFeedback('error', '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openCreateProduct = () => {
    setProductModal('create')
    setProductForm({ productName: '', description: '', price: '', imageUrl: '' })
    setProductErrors({})
  }

  const openEditProduct = (product) => {
    setProductModal(product)
    setProductForm({
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      imageUrl: product.imageUrl || '',
    })
    setProductErrors({})
  }

  const validateProduct = () => {
    const errs = {}
    if (!productForm.productName.trim()) errs.productName = '商品名称不能为空'
    const price = parseFloat(productForm.price)
    if (isNaN(price) || price < 0) errs.price = '价格必须为非负数'
    setProductErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveProduct = async () => {
    if (!validateProduct()) return
    setSaving(true)
    try {
      if (productModal === 'create') {
        await api.post('/merchant/products', productForm)
        showFeedback('success', '商品已上架')
      } else {
        await api.put(`/merchant/products/${productModal.id}`, productForm)
        showFeedback('success', '商品已更新')
      }
      setProductModal(null)
      fetchData()
    } catch (err) {
      showFeedback('error', err.response?.data?.error || '操作失败')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!confirm(`确定下架 ${product.productName}?`)) return
    try {
      await api.delete(`/merchant/products/${product.id}`)
      showFeedback('success', '商品已下架')
      fetchData()
    } catch (err) {
      showFeedback('error', '删除失败')
    }
  }

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    try {
      await api.put(`/merchant/products/${product.id}`, { status: newStatus })
      showFeedback('success', `商品已${newStatus === 'active' ? '上架' : '下架'}`)
      fetchData()
    } catch (err) {
      showFeedback('error', '状态更新失败')
    }
  }

  const openCreateShop = () => {
    setShopModal('create')
    setShopForm({ shopName: '', description: '' })
    setShopErrors({})
  }

  const openEditShop = () => {
    setShopModal('edit')
    setShopForm({
      shopName: shop.shopName,
      description: shop.description || '',
    })
    setShopErrors({})
  }

  const validateShop = () => {
    const errs = {}
    if (!shopForm.shopName.trim()) errs.shopName = '店铺名称不能为空'
    setShopErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveShop = async () => {
    if (!validateShop()) return
    setShopSaving(true)
    try {
      if (shopModal === 'create') {
        await api.post('/merchant/shop', shopForm)
        showFeedback('success', '店铺创建成功')
      } else {
        await api.put('/merchant/shop', shopForm)
        showFeedback('success', '店铺已更新')
      }
      setShopModal(null)
      fetchData()
    } catch (err) {
      showFeedback('error', err.response?.data?.error || '操作失败')
    } finally {
      setShopSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-text-primary mb-3">Merchant Panel</h1>

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
          { key: 'products', label: 'Products' },
          { key: 'orders', label: 'Sales' },
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

      {loading ? (
        tab === 'products' ? <SkeletonTable rows={4} cols={5} /> : <SkeletonTable rows={4} cols={5} />
      ) : tab === 'products' ? (
        <>
          {!shop ? (
            <Card>
              <p className="text-text-secondary text-xs mb-3">你还没有店铺</p>
              <Button size="sm" onClick={openCreateShop}>Create Shop</Button>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm text-text-primary">{shop.shopName}</span>
                  <button
                    onClick={openEditShop}
                    className="ml-2 text-text-secondary hover:text-accent transition-colors duration-150 text-xs"
                    title="编辑商店信息"
                  >
                    ✎
                  </button>
                  {shop.description && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{shop.description}</p>
                  )}
                </div>
                <Button size="sm" onClick={openCreateProduct}>+ New Product</Button>
              </div>

              {products.length === 0 ? (
                <p className="text-text-secondary text-xs text-center py-6">No products yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border-color">
                        <th className="text-left py-2 px-2 text-text-secondary font-medium w-8"></th>
                        <th className="text-left py-2 px-2 text-text-secondary font-medium">Name</th>
                        <th className="text-right py-2 px-2 text-text-secondary font-medium font-mono">Price</th>
                        <th className="text-left py-2 px-2 text-text-secondary font-medium">Status</th>
                        <th className="text-right py-2 px-2 text-text-secondary font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, i) => (
                        <tr key={p.id} className={`border-b border-border-color/50 ${i % 2 === 1 ? 'bg-bg-card/30' : ''}`}>
                          <td className="py-2 px-2">
                            <div className="w-7 h-7 rounded-sm bg-bg-primary border border-border-color overflow-hidden flex items-center justify-center">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                              ) : (
                                <span className="text-text-secondary text-[10px] font-mono">Img</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <div className="text-text-primary">{p.productName}</div>
                            {p.description && (
                              <div className="text-text-secondary text-xs mt-0.5 line-clamp-1">{p.description}</div>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-accent">
                            ¥{parseFloat(p.price).toLocaleString()}
                          </td>
                          <td className="py-2 px-2">
                            <Badge variant={p.status === 'active' ? 'active' : 'warning'}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-right space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(p)}>
                              {p.status === 'active' ? 'Off' : 'On'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditProduct(p)}>Edit</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(p)}>
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

          <Modal
            isOpen={!!productModal}
            onClose={() => setProductModal(null)}
            title={productModal === 'create' ? 'New Product' : 'Edit Product'}
          >
            <div className="space-y-3">
              <Input
                label="商品名称"
                value={productForm.productName}
                onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                placeholder="Product name"
                error={productErrors.productName}
              />
              <div>
                <label className="block text-xs text-text-secondary mb-1 font-medium tracking-wide uppercase">
                  封面图片URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                      placeholder="粘贴图片链接，如 https://example.com/car.jpg"
                      className={`
                        w-full h-5 px-2 bg-bg-card border rounded text-sm text-text-primary font-mono
                        placeholder:text-text-secondary/50
                        transition-all duration-150 ease-out
                        focus:outline-none focus:border-accent
                        border-border-color
                      `}
                    />
                  </div>
                  <div className="w-[120px] h-[80px] rounded-sm bg-bg-card border border-border-color flex items-center justify-center overflow-hidden flex-shrink-0">
                    <ProductImagePreview url={productForm.imageUrl} />
                  </div>
                </div>
              </div>
              <Input
                label="描述"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Product description (optional)"
              />
              <Input
                label="价格"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="0.00"
                error={productErrors.price}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setProductModal(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveProduct} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={!!shopModal}
            onClose={() => setShopModal(null)}
            title={shopModal === 'create' ? 'Create Shop' : 'Edit Shop'}
          >
            <div className="space-y-3">
              <Input
                label="店铺名称"
                value={shopForm.shopName}
                onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                placeholder="Shop name"
                error={shopErrors.shopName}
              />
              <div className="w-full">
                <label className="block text-xs text-text-secondary mb-1 font-medium tracking-wide uppercase">
                  店铺简介
                </label>
                <textarea
                  value={shopForm.description}
                  onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                  placeholder="Shop description (optional)"
                  rows={3}
                  className={`
                    w-full px-2 py-2 bg-bg-card border rounded text-sm text-text-primary font-mono
                    placeholder:text-text-secondary/50
                    transition-all duration-150 ease-out
                    focus:outline-none focus:border-accent
                    resize-none
                    border-border-color
                  `}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setShopModal(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveShop} disabled={shopSaving}>
                  {shopSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <>
          {orders.length === 0 ? (
            <p className="text-text-secondary text-xs text-center py-6">No sales records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-color">
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">ID</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Buyer</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Product</th>
                    <th className="text-right py-2 px-2 text-text-secondary font-medium font-mono">Price</th>
                    <th className="text-left py-2 px-2 text-text-secondary font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} className={`border-b border-border-color/50 ${i % 2 === 1 ? 'bg-bg-card/30' : ''}`}>
                      <td className="py-2 px-2 text-text-secondary">{o.id}</td>
                      <td className="py-2 px-2 text-text-primary">{o.user?.username}</td>
                      <td className="py-2 px-2 text-text-primary">{o.product?.productName}</td>
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
        </>
      )}
    </div>
  )
}
