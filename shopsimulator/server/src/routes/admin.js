import express from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)
router.use(requireRole('admin'))

router.get('/users', async (req, res) => {
  try {
    const { search, role } = req.query
    const where = {}
    if (search) {
      where.username = { contains: search }
    }
    if (role) {
      where.role = role
    }
    const users = await req.app.locals.prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        role: true,
        balance: true,
        createdAt: true,
        _count: { select: { shops: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    const mapped = users.map((u) => ({
      ...u,
      balance: u.balance.toString(),
    }))
    res.json(mapped)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取用户列表失败' })
  }
})

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { username, role } = req.body

    const user = await req.app.locals.prisma.user.findUnique({
      where: { id: parseInt(id) },
    })
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    const updateData = {}
    if (username) updateData.username = username
    if (role) updateData.role = role

    const updated = await req.app.locals.prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        balance: true,
      },
    })

    res.json({
      ...updated,
      balance: updated.balance.toString(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新用户失败' })
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = parseInt(id)

    const user = await req.app.locals.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    if (user.role === 'admin') {
      return res.status(403).json({ error: '不能删除管理员账号' })
    }

    await req.app.locals.prisma.user.delete({
      where: { id: userId },
    })

    res.json({ message: '删除成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '删除用户失败' })
  }
})

router.post('/top-up', async (req, res) => {
  try {
    const { userId, amount } = req.body

    if (!userId || amount === undefined || amount === null) {
      return res.status(400).json({ error: '用户 ID 和金额为必填项' })
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: '金额必须为正数' })
    }

    if (numAmount > 999999999) {
      return res.status(400).json({ error: '单次充值金额不能超过 999,999,999' })
    }

    const user = await req.app.locals.prisma.user.findUnique({
      where: { id: parseInt(userId) },
    })
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }

    const updated = await req.app.locals.prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        balance: { increment: numAmount },
      },
      select: {
        id: true,
        username: true,
        balance: true,
      },
    })

    res.json({
      message: `成功向 ${updated.username} 充值 ${numAmount}`,
      user: {
        ...updated,
        balance: updated.balance.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '充值失败' })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const orders = await req.app.locals.prisma.order.findMany({
      include: {
        user: { select: { id: true, username: true } },
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
    res.status(500).json({ error: '获取订单列表失败' })
  }
})

router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params
    await req.app.locals.prisma.order.delete({
      where: { id: parseInt(id) },
    })
    res.json({ message: '订单已删除' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '删除订单失败' })
  }
})

export default router
