import bcryptjs from 'bcryptjs'

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcryptjs.hash('admin123', 10)
  const hashedMerchant = await bcryptjs.hash('merchant123', 10)
  const hashedUser = await bcryptjs.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      balance: 999999.00,
    },
  })

  const merchant = await prisma.user.upsert({
    where: { username: 'merchant01' },
    update: {},
    create: {
      username: 'merchant01',
      password: hashedMerchant,
      role: 'merchant',
      balance: 0.00,
      shops: {
        create: {
          shopName: '法拉利旗舰店',
          description: '全球限量超跑，虚拟体验极致速度',
        },
      },
    },
  })

  const user = await prisma.user.upsert({
    where: { username: 'buyer01' },
    update: {},
    create: {
      username: 'buyer01',
      password: hashedUser,
      role: 'user',
      balance: 1000000.00,
    },
  })

  const shop = await prisma.shop.findFirst({ where: { shopName: '法拉利旗舰店' } })
  if (shop) {
    const products = [
      { productName: '法拉利 SF90 Stradale', description: 'V8 双涡轮增压混合动力，1000 马力', price: 5000000.00 },
      { productName: '法拉利 296 GTB', description: 'V6 混合动力中置引擎，830 马力', price: 3500000.00 },
      { productName: '法拉利 Roma', description: 'V8 前置引擎 GT，620 马力', price: 2800000.00 },
      { productName: '法拉利 F8 Tributo', description: 'V8 中置双涡轮，720 马力', price: 4200000.00 },
      { productName: '法拉利 812 Superfast', description: 'V12 自然吸气前置，800 马力', price: 6000000.00 },
    ]
    for (const p of products) {
      await prisma.product.upsert({
        where: { id: products.indexOf(p) + 1 },
        update: {},
        create: { ...p, shopId: shop.id },
      })
    }
  }

  console.log('Seed data created successfully')
  console.log('Admin: admin / admin123')
  console.log('Merchant: merchant01 / merchant123')
  console.log('User: buyer01 / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
