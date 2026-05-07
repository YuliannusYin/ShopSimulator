import { useState, useEffect } from 'react'
import api from '../../api'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'

export default function UserBalance() {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data } = await api.get('/user/balance')
        setBalance(data)
      } catch (err) {
        setError('获取余额失败')
      } finally {
        setLoading(false)
      }
    }
    fetchBalance()
  }, [])

  if (loading) {
    return (
      <div>
        <h1 className="text-base font-semibold text-text-primary mb-3">My Balance</h1>
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-text-primary mb-3">My Balance</h1>

      {error ? (
        <p className="text-xs text-error">{error}</p>
      ) : balance ? (
        <Card>
          <p className="text-xs text-text-secondary mb-1">{balance.username}</p>
          <p className="text-2xl font-mono text-accent font-semibold">
            ¥{parseFloat(balance.balance).toLocaleString()}
          </p>
          <p className="text-xs text-text-secondary/60 mt-2">
            Available balance for shopping
          </p>
        </Card>
      ) : null}
    </div>
  )
}
