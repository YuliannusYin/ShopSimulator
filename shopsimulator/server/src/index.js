import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import merchantRoutes from './routes/merchant.js'
import userRoutes from './routes/user.js'
import publicRoutes from './routes/public.js'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.locals.prisma = prisma

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/merchant', merchantRoutes)
app.use('/api/user', userRoutes)
app.use('/api', publicRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`ShopSimulator Server running on http://localhost:${PORT}`)
})
