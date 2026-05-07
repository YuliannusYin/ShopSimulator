import express from 'express'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body

    if (!username || !password || !role) {
      return res.status(400).json({ error: '用户名、密码和角色均为必填项' })
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ error: '用户名长度需在 3-50 个字符之间' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少 6 个字符' })
    }

    if (!['merchant', 'user'].includes(role)) {
      return res.status(400).json({ error: '角色只能是 merchant 或 user' })
    }

    const existing = await req.app.locals.prisma.user.findUnique({
      where: { username },
    })

    if (existing) {
      return res.status(409).json({ error: '用户名已存在' })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const user = await req.app.locals.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        balance: 0.00,
      },
    })

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.balance.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码均为必填项' })
    }

    const user = await req.app.locals.prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const valid = await bcryptjs.compare(password, user.password)
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.balance.toString(),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

export default router
