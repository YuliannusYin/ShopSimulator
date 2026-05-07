import express from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)
router.use(requireRole('user'))

router.get('/orders', async (req, res) => {
  try {
    const orders = await req.app.locals.prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        product: { select: { id: true, productName: true, price: true } },
        shop: { select: { id: true, shopName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = orders.map((o) => ({
      ...o,
      totalPrice: o.totalPrice.toString(),
      product: {
        ...o.product,
        price: o.product.price.toString(),
      },
    }))

    res.json(mapped)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取订单记录失败' })
  }
})

router.get('/balance', async (req, res) => {
  try {
    const user = await req.app.locals.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, balance: true },
    })

    res.json({
      ...user,
      balance: user.balance.toString(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取余额失败' })
  }
})

export default router
