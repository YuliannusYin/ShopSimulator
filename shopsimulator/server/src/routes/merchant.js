import express from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)
router.use(requireRole('merchant'))

router.post('/shop', async (req, res) => {
  try {
    const { shopName, description } = req.body

    if (!shopName || shopName.trim().length === 0) {
      return res.status(400).json({ error: '店铺名称不能为空' })
    }

    const existing = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    if (existing) {
      return res.status(409).json({ error: '每个商户只能拥有一个店铺' })
    }

    const shop = await req.app.locals.prisma.shop.create({
      data: {
        merchantId: req.user.id,
        shopName: shopName.trim(),
        description: description || null,
      },
    })

    res.status(201).json(shop)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '创建店铺失败' })
  }
})

router.put('/shop', async (req, res) => {
  try {
    const { shopName, description } = req.body

    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    if (!shop) {
      return res.status(404).json({ error: '店铺不存在，请先创建店铺' })
    }

    const updated = await req.app.locals.prisma.shop.update({
      where: { id: shop.id },
      data: {
        shopName: shopName || shop.shopName,
        description: description !== undefined ? description : shop.description,
      },
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新店铺失败' })
  }
})

router.get('/shop', async (req, res) => {
  try {
    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    if (!shop) {
      return res.json(null)
    }

    res.json(shop)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '获取店铺信息失败' })
  }
})

router.get('/products', async (req, res) => {
  try {
    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    if (!shop) {
      return res.json([])
    }

    const products = await req.app.locals.prisma.product.findMany({
      where: { shopId: shop.id },
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

router.post('/products', async (req, res) => {
  try {
    const { productName, description, price, imageUrl } = req.body

    if (!productName || productName.trim().length === 0) {
      return res.status(400).json({ error: '商品名称不能为空' })
    }

    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ error: '价格必须为非负数' })
    }

    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    if (!shop) {
      return res.status(404).json({ error: '请先创建店铺' })
    }

    const product = await req.app.locals.prisma.product.create({
      data: {
        shopId: shop.id,
        productName: productName.trim(),
        description: description || null,
        price: numPrice,
        imageUrl: imageUrl || null,
      },
    })

    res.status(201).json({
      ...product,
      price: product.price.toString(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '上架商品失败' })
  }
})

router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { productName, description, price, imageUrl, status } = req.body

    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    const product = await req.app.locals.prisma.product.findUnique({
      where: { id: parseInt(id) },
    })

    if (!product || product.shopId !== shop?.id) {
      return res.status(404).json({ error: '商品不存在' })
    }

    const updateData = {}
    if (productName) updateData.productName = productName
    if (description !== undefined) updateData.description = description
    if (price !== undefined) {
      const numPrice = parseFloat(price)
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({ error: '价格必须为非负数' })
      }
      updateData.price = numPrice
    }
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (status) updateData.status = status

    const updated = await req.app.locals.prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    res.json({
      ...updated,
      price: updated.price.toString(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '更新商品失败' })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    const product = await req.app.locals.prisma.product.findUnique({
      where: { id: parseInt(id) },
    })

    if (!product || product.shopId !== shop?.id) {
      return res.status(404).json({ error: '商品不存在' })
    }

    await req.app.locals.prisma.product.delete({
      where: { id: parseInt(id) },
    })

    res.json({ message: '商品已下架' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '删除商品失败' })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const shop = await req.app.locals.prisma.shop.findFirst({
      where: { merchantId: req.user.id },
    })

    if (!shop) {
      return res.json([])
    }

    const orders = await req.app.locals.prisma.order.findMany({
      where: { shopId: shop.id },
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
    res.status(500).json({ error: '获取销售记录失败' })
  }
})

export default router
