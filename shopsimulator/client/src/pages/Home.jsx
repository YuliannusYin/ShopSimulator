import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { SkeletonCard } from '../components/ui/Skeleton'

export default function Home() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const fetchShops = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/shops')
      setShops(data)
    } catch (err) {
      setError('加载店铺列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  const filtered = shops.filter((s) =>
    s.shopName.toLowerCase().includes(search.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-base font-semibold text-text-primary">Shops</h1>
        <p className="text-xs text-text-secondary mt-1">Browse all merchant stores</p>
      </div>

      <div className="mb-3 max-w-xs">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops..."
        />
      </div>

      {error && <p className="text-xs text-error mb-3">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary text-sm">
            {search ? 'No shops match your search' : 'No shops available yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.map((shop) => (
            <Link key={shop.id} to={`/shop/${shop.id}`}>
              <Card hover>
                <h2 className="text-sm font-semibold text-text-primary mb-1">{shop.shopName}</h2>
                {shop.description && (
                  <p className="text-xs text-text-secondary mb-2 line-clamp-2">{shop.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">
                    {shop.merchant?.username}
                  </span>
                  <span className="text-xs font-mono text-accent">
                    {shop._count?.products || 0} products
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
