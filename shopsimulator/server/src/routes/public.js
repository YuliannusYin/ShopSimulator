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

router.get('/products/random', async (req, res) => {
  try {
    const count = Math.min(Math.max(parseInt(req.query.count) || 8, 1), 50)

    const rows = await req.app.locals.prisma.$queryRawUnsafe(`
      SELECT p.id, p.product_name, p.description, p.price, p.image_url, p.status, p.created_at, p.shop_id, s.shop_name
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE p.status = 'active'
      ORDER BY RAND()
      LIMIT ${count}
    `)

    const products = rows.map((r) => ({
      id: r.id,
      productName: r.product_name,
      description: r.description,
      price: r.price.toString(),
      imageUrl: r.image_url,
      status: r.status,
      createdAt: r.created_at,
      shopId: r.shop_id,
      shop: {
        id: r.shop_id,
        shopName: r.shop_name,
      },
    }))

    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取随机商品失败' })
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
      include: {
        shop: { select: { merchantId: true } },
      },
    })

    if (!product || product.status !== 'active') {
      return res.status(404).json({ error: '商品不存在或已下架' })
    }

    if (req.user.id === product.shop.merchantId) {
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
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: { balance: { decrement: totalPrice } },
        select: { id: true, username: true, role: true, balance: true },
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

      return { order, updatedUser }
    })

    res.status(201).json({
      message: '购买成功',
      user: {
        ...result.updatedUser,
        balance: result.updatedUser.balance.toString(),
      },
      order: {
        ...result.order,
        totalPrice: result.order.totalPrice.toString(),
        product: {
          ...result.order.product,
          price: result.order.product.price.toString(),
        },
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '下单失败' })
  }
})

export default router
