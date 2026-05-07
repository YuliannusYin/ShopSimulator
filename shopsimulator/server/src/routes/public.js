import express from 'express'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/shops', async (req, res) => {
  try {
    const shops = await req.app.locals.prisma.shop.findMany({
      include: {
        merchant: {
          select: { id: true, username: true },
        },
        _count: {
          select: {
            products: {
              where: { status: 'active' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(shops)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取店铺列表失败' })
  }
})

router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await req.app.locals.prisma.shop.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        merchant: {
          select: { id: true, username: true },
        },
      },
    })

    if (!shop) {
      return res.status(404).json({ error: '店铺不存在' })
    }

    res.json(shop)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取店铺详情失败' })
  }
})

router.get('/products', async (req, res) => {
  try {
    const { shopId } = req.query
    const where = { status: 'active' }

    if (shopId) {
      where.shopId = parseInt(shopId)
    }

    const products = await req.app.locals.prisma.product.findMany({
      where,
      include: {
        shop: {
          select: { id: true, shopName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = products.map((p) => ({
      ...p,
      price: p.price.toString(),
    }))

    res.json(mapped)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取商品列表失败' })
  }
})

router.get('/products/:id', async (req, res) => {
  try {
    const product = await req.app.locals.prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        shop: {
          select: { id: true, shopName: true },
        },
      },
    })

    if (!product) {
      return res.status(404).json({ error: '商品不存在' })
    }

    res.json({
      ...product,
      price: product.price.toString(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取商品详情失败' })
  }
})

router.post('/orders', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId) {
      return res.status(400).json({ error: '商品 ID 为必填项' })
    }

    const numQuantity = quantity || 1
    if (numQuantity < 1) {
      return res.status(400).json({ error: '购买数量至少为 1' })
    }

    const product = await req.app.locals.prisma.product.findUnique({
      where: { id: parseInt(productId) },
    })

    if (!product || product.status !== 'active') {
      return res.status(404).json({ error: '商品不存在或已下架' })
    }

    if (req.user.id === product.shopId) {
      return res.status(403).json({ error: '不能购买自己店铺的商品' })
    }

    const user = await req.app.locals.prisma.user.findUnique({
      where: { id: req.user.id },
    })

    const totalPrice = parseFloat(product.price) * numQuantity

    if (parseFloat(user.balance) < totalPrice) {
      return res.status(400).json({ error: '余额不足' })
    }

    const result = await req.app.locals.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: req.user.id },
        data: { balance: { decrement: totalPrice } },
      })

      const merchant = await tx.shop.findUnique({
        where: { id: product.shopId },
        select: { merchantId: true },
      })

      await tx.user.update({
        where: { id: merchant.merchantId },
        data: { balance: { increment: totalPrice } },
      })

      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          productId: product.id,
          shopId: product.shopId,
          quantity: numQuantity,
          totalPrice,
        },
        include: {
          product: { select: { id: true, productName: true, price: true } },
          shop: { select: { id: true, shopName: true } },
        },
      })

      return order
    })

    res.status(201).json({
      message: '购买成功',
      order: {
        ...result,
        totalPrice: result.totalPrice.toString(),
        product: {
          ...result.product,
          price: result.product.price.toString(),
        },
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '下单失败' })
  }
})

export default router
