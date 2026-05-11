import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const users = await prisma.user.findMany()
  const shops = await prisma.shop.findMany()
  const products = await prisma.product.findMany()
  const orders = await prisma.order.findMany()

  let code = `import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

`

  for (const u of users) {
    code += `  await prisma.user.upsert({
    where: { username: '${u.username}' },
    update: {},
    create: {
      username: '${u.username}',
      password: '${u.password}',
      role: '${u.role}',
      balance: ${Number(u.balance)},
    },
  })
`
  }

  for (const s of shops) {
    code += `
  await prisma.shop.upsert({
    where: { id: ${s.id} },
    update: {},
    create: {
      merchantId: ${s.merchantId},
      shopName: '${s.shopName.replace(/'/g, "\\'")}',
      description: ${s.description ? `'${s.description.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'` : 'null'},
      createdAt: new Date('${s.createdAt.toISOString()}'),
    },
  })
`
  }

  for (const p of products) {
    code += `
  await prisma.product.upsert({
    where: { id: ${p.id} },
    update: {},
    create: {
      shopId: ${p.shopId},
      productName: '${p.productName.replace(/'/g, "\\'")}',
      description: ${p.description ? `'${p.description.replace(/'/g, "\\'").replace(/\n/g, '\\n')}'` : 'null'},
      price: ${Number(p.price)},
      imageUrl: ${p.imageUrl ? `'${p.imageUrl.replace(/'/g, "\\'")}'` : 'null'},
      status: '${p.status}',
      createdAt: new Date('${p.createdAt.toISOString()}'),
    },
  })
`
  }

  for (const o of orders) {
    code += `
  await prisma.order.upsert({
    where: { id: ${o.id} },
    update: {},
    create: {
      userId: ${o.userId},
      productId: ${o.productId},
      shopId: ${o.shopId},
      quantity: ${o.quantity},
      totalPrice: ${Number(o.totalPrice)},
      createdAt: new Date('${o.createdAt.toISOString()}'),
    },
  })
`
  }

  code += `
  console.log('Seed data imported successfully')
  console.log('Users: ${users.length}')
  console.log('Shops: ${shops.length}')
  console.log('Products: ${products.length}')
  console.log('Orders: ${orders.length}')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`

  fs.writeFileSync(path.join(__dirname, 'seed.js'), code, 'utf-8')
  console.log(`✓ seed.js 已生成`)
  console.log(`  ${users.length} users / ${shops.length} shops / ${products.length} products / ${orders.length} orders`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
