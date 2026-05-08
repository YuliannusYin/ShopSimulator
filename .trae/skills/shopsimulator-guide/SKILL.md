---
name: shopsimulator-guide
description: ShopSimulator 项目专属开发智能体。掌握全部项目上下文、技术栈、设计规范和代码风格。当开发 ShopSimulator 新功能、修改现有代码、修复 Bug 或任何针对 shopsimulator 目录的操作时调用。使用前无需重复解释项目背景。
---

# ShopSimulator 项目开发智能体

你是 ShopSimulator 全栈项目的专属开发助手，已内化该项目的全部上下文。以下是你必须遵循的一切。

---

## 一、项目概述

ShopSimulator 是一个极简模拟购物平台。用户可扮演三种角色：
- **Admin**：管理所有账号、打钱、查看/删除订单
- **Merchant**：创建店铺、管理商品（含封面图）、查看销售记录
- **User**：浏览店铺/商品、购买、逛商场、查看订单和余额

核心理念：**极简主义 × 极客审美**。参考 Apple 官网的留白、GitHub 暗色模式、Linear 的微交互。

---

## 二、技术栈（严格遵循）

| 层级 | 技术 | 版本/备注 |
|------|------|-----------|
| 前端框架 | React 18 | 函数组件 + Hooks |
| 构建工具 | Vite 6 | 端口 5173，proxy `/api` → localhost:3001 |
| 样式方案 | Tailwind CSS 3 + CSS Variables | darkMode: 'class' |
| 状态管理 | Zustand 5 | 轻量无模板代码 |
| 路由 | React Router v6 | 页面级路由 |
| HTTP | Axios | baseURL `/api`，JWT 拦截器 |
| 后端 | Node.js + Express | 端口 3001 |
| ORM | Prisma 5 | MySQL 数据库 |
| 认证 | JWT + bcryptjs | 7 天过期 |
| 数据库 | MySQL 8.0 | Docker Compose 启动 |
| UI 框架 | **无** | 手写全部组件，不引入第三方 UI 库 |

---

## 三、项目目录结构

```
shopsimulator/
├── client/                          # 前端
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js             # Axios 实例（JWT 拦截器）
│   │   ├── components/
│   │   │   ├── ui/                  # 原子 UI 组件
│   │   │   │   ├── Button.jsx       # variant: primary|secondary|danger|ghost, size: sm|md|lg
│   │   │   │   ├── Input.jsx        # label, error 支持
│   │   │   │   ├── Card.jsx         # hover 属性 → 边框变 accent
│   │   │   │   ├── Badge.jsx        # variant: default|active|warning|error
│   │   │   │   ├── Modal.jsx        # Esc 关闭, 点击遮罩关闭
│   │   │   │   └── Skeleton.jsx     # 默认导出 + SkeletonLine/SkeletonCard/SkeletonTable
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx       # flex h-screen 布局：Sidebar + (TopBar + main)
│   │   │   │   ├── Sidebar.jsx      # 可折叠，按角色显示导航链接
│   │   │   │   └── TopBar.jsx       # 主题切换 + 余额 + logout
│   │   │   └── shared/
│   │   │       └── ProtectedRoute.jsx  # roles 白名单检查，token→/login，role→默认路由
│   │   ├── pages/
│   │   │   ├── Login.jsx            # 无 Layout，居中表单
│   │   │   ├── Register.jsx         # 无 Layout，选角色(merchant/user)
│   │   │   ├── Home.jsx             # 店铺网格 + 逛商场入口卡片
│   │   │   ├── ShopDetail.jsx       # 商品列表（含缩略图）+ 可点击跳详情 + 快速购买
│   │   │   ├── ProductDetail.jsx    # 商品大图/名称/价格/描述/底部购买条/数量弹窗
│   │   │   ├── Explore.jsx          # 逛商场：随机商品网格/换一批/+快速购买/toast 轻提示
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.jsx    # Tab: Users/Orders，含 Edit/Topup/Delete Modal
│   │   │   ├── merchant/
│   │   │   │   └── Dashboard.jsx    # Tab: Products/Sales，含 Shop CRUD/Product CRUD/缩略图
│   │   │   └── user/
│   │   │       ├── Orders.jsx       # 购买记录表格
│   │   │       └── Balance.jsx      # 余额卡片
│   │   ├── stores/
│   │   │   ├── authStore.js         # token + user，localStorage 持久化
│   │   │   ├── productStore.js      # products/loading/error
│   │   │   └── orderStore.js        # orders/loading/error
│   │   ├── styles/
│   │   │   └── globals.css          # CSS Variables（暗色+亮色）+ 全局重置
│   │   ├── App.jsx                  # 路由定义 + ProtectedRoute 包装
│   │   └── main.jsx                 # 入口：BrowserRouter + 主题初始化
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── prisma/
│   │   ├── schema.prisma            # User/Shop/Product/Order 四模型
│   │   └── seed.js                  # 测试数据：admin/merchant01/buyer01
│   ├── src/
│   │   ├── index.js                 # Express 入口，prisma 挂载到 app.locals
│   │   ├── middleware/
│   │   │   └── auth.js              # authenticate + requireRole(...roles)
│   │   └── routes/
│   │       ├── auth.js              # POST /register, POST /login
│   │       ├── admin.js             # 全部需要 authenticate + requireRole('admin')
│   │       ├── merchant.js          # 全部需要 authenticate + requireRole('merchant')
│   │       ├── user.js              # 全部需要 authenticate + requireRole('user')
│   │       └── public.js            # 公开 shops/products + 需要认证的 POST /orders
│   ├── .env
│   └── package.json
└── docker-compose.yml               # MySQL 8.0，端口 3306
```

---

## 四、设计系统（铁律，不可偏离）

### 4.1 色彩方案

```css
/* 暗色（默认） */
--bg-primary: #0D0D0D;       /* 主背景 */
--bg-card: #1A1A1A;          /* 卡片/面板 */
--border-color: #2A2A2A;     /* 边框/分割线 */
--text-primary: #E5E5E5;     /* 主文字 */
--text-secondary: #888888;   /* 次要文字 */
--accent: #00FF88;           /* 强调色（荧光绿） */
--accent-warning: #FF6B35;   /* 警告/删除/金额 */
--success: #00FF88;
--error: #FF4444;

/* 亮色 */
.light {
  --bg-primary: #F5F5F5;
  --bg-card: #FFFFFF;
  --border-color: #E0E0E0;
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --accent: #00CC66;
  --accent-warning: #E55A2B;
  --success: #00CC66;
  --error: #DD3333;
}
```

### 4.2 Tailwind 自定义类（必须使用，不可直接写 hex）

| Tailwind Class | CSS Variable | 暗色值 |
|---------------|-------------|--------|
| `bg-bg-primary` | `--bg-primary` | `#0D0D0D` |
| `bg-bg-card` | `--bg-card` | `#1A1A1A` |
| `border-border-color` | `--border-color` | `#2A2A2A` |
| `text-text-primary` | `--text-primary` | `#E5E5E5` |
| `text-text-secondary` | `--text-secondary` | `#888888` |
| `text-accent` / `border-accent` / `bg-accent` | `--accent` | `#00FF88` |
| `text-accent-warning` / `border-accent-warning` | `--accent-warning` | `#FF6B35` |
| `text-error` | `--error` | `#FF4444` |

### 4.3 字体

- **代码/数据/价格**：`font-mono` (JetBrains Mono → Consolas → monospace)
- **标题/正文**：`font-sans` (Inter → SF Pro Display → sans-serif)

### 4.4 间距（8px 栅格）

| Class | px |
|-------|----|
| `p-1` / `m-1` / `gap-1` | 8px |
| `p-2` / `m-2` / `gap-2` | 16px |
| `p-3` / `m-3` / `gap-3` | 24px |
| `p-4` / `m-4` / `gap-4` | 32px |

### 4.5 动效

- **hover**：一律 `transition-all duration-150 ease-out`
- **button active**：`brightness-90` 或 `brightness-110`
- **卡片 hover**：可用 `hover:scale-[1.02]` 轻微放大
- **路由切换**：无动画，直接切换
- **加载**：骨架屏（Skeleton 组件），不用 spinner

### 4.6 视觉原则

- 无线条、无阴影、无渐变，仅凭明度差区分层级
- 卡片式布局，`rounded` (6px) 圆角
- 购买按钮极简，`+` 号或 `Buy Now`
- 操作按钮为无底色文字链接 (ghost variant)
- 表格斑马纹：`i % 2 === 1 ? 'bg-bg-card/30' : ''`
- 图片缩略图统一用 `rounded-sm` (4px)，`bg-bg-primary` 背景，`border-border-color` 边框

### 4.7 缩略图规范（重要）

商品图片在以下位置都需渲染缩略图：

| 位置 | 容器尺寸 | 类名 |
|------|----------|------|
| 商户商品表格 | 28×28 (w-7 h-7) | `rounded-sm bg-bg-primary border border-border-color` |
| 店铺详情列表 | 48×48 (w-12 h-12) | `rounded-sm bg-bg-primary border border-border-color` |
| 逛商场卡片 | 4:3 宽高比 | `aspect-[4/3] rounded-sm bg-bg-primary` |
| 商品详情页 | 16:9 宽高比 | `aspect-video rounded bg-bg-card border border-border-color` |
| 商户表单预览 | 120×80 (w-[120px] h-[80px]) | `rounded-sm bg-bg-card border border-border-color` |

无图时显示占位文字 `"Img"` (`text-text-secondary text-xs font-mono`)，不是链接文本。
所有 `<img>` 用 `w-full h-full object-cover`，并加 `onError` 隐藏处理。

---

## 五、代码约定

### 5.1 前端模式

**组件写法**：函数组件 + 默认导出
```jsx
export default function ComponentName({ prop1, prop2 }) {
  // ...
}
```

**API 调用**：
```js
import api from '../api'           // 页面级
import api from '../../api'        // pages 子目录

// 使用
const { data } = await api.get('/shops')
const { data } = await api.post('/orders', { productId, quantity })
const { data } = await api.put(`/admin/users/${id}`, updateData)
await api.delete(`/admin/users/${id}`)
```

**状态管理**：
```js
// 读取
const { token, user } = useAuthStore()
const user = useAuthStore((s) => s.user)

// 更新（在 store action 之外）
useAuthStore.getState().setAuth(token, updatedUser)
useAuthStore.getState().logout()
```

**路由守卫**：
```jsx
<ProtectedRoute roles={['admin']}>
  <Layout><AdminDashboard /></Layout>
</ProtectedRoute>
```

**反馈消息**（统一模式）：
```js
const [feedback, setFeedback] = useState({ type: '', message: '' })
// 显示：
{feedback.message && (
  <div className={`mb-3 p-2 border rounded text-xs ${
    feedback.type === 'success'
      ? 'border-accent/30 text-accent bg-accent/5'
      : 'border-error/30 text-error bg-error/5'
  }`}>
    {feedback.message}
  </div>
)}
```

**Toast 轻提示**（Explore 专用）：
```jsx
{toast && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-bg-card border border-accent rounded text-xs text-accent font-mono shadow-none">
    {toast}
  </div>
)}
```

**页面标题**：`<h1 className="text-base font-semibold text-text-primary mb-3">`
特殊页面标题（Explore）：`<h1 className="text-2xl font-bold text-text-primary tracking-wide">`

**底部固定按钮**（ProductDetail）：
```jsx
<div className="sticky bottom-0 -mx-3 -mb-3 px-3 py-3 bg-bg-primary/95 border-t border-border-color">
```

**点击隔离**（卡片可跳转但内嵌按钮独立）：
```jsx
<Link to={`/product/${id}`}>
  {/* 卡片内容 */}
  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBuy() }}>
    +
  </button>
</Link>
```

### 5.2 后端模式

**Prisma 访问**：
```js
req.app.locals.prisma.user.findMany({ ... })
req.app.locals.prisma.order.create({ data: { ... } })
```

**认证中间件**：
```js
router.use(authenticate)              // 需要登录
router.use(requireRole('admin'))      // 需要 admin 角色
```

**Decimal 序列化**：后端返回 balance/price 时必须 `.toString()`
```js
balance: user.balance.toString()
price: product.price.toString()
```

**事务**（购买操作）：
```js
await req.app.locals.prisma.$transaction(async (tx) => {
  await tx.user.update(...)
  const order = await tx.order.create(...)
  return order
})
```

### 5.3 数据库模型

```
User { id, username(unique), password, role(admin|merchant|user), balance(Decimal), createdAt }
  → has many Shop
  → has many Order (UserOrders)

Shop { id, merchantId, shopName, description?, createdAt }
  → belongs to User(merchant)
  → has many Product
  → has many Order (ShopOrders)

Product { id, shopId, productName, description?, price(Decimal), imageUrl?, status(active|inactive), createdAt }
  → belongs to Shop

Order { id, userId, productId, shopId, quantity, totalPrice(Decimal), createdAt }
  → belongs to User(UserOrders)
  → belongs to Product
  → belongs to Shop(ShopOrders)
```

### 5.4 Merchant Dashboard 关键模式

**productModal 双态**：`'create'` 字符串（新建） vs `product` 对象（编辑）
```js
// 创建
setProductModal('create')
setProductForm({ productName: '', description: '', price: '', imageUrl: '' })

// 编辑 — 存完整 product 对象以获取 .id
setProductModal(product)
setProductForm({
  productName: product.productName,
  description: product.description || '',
  price: product.price,
  imageUrl: product.imageUrl || '',  // 必须回填
})

// 判断
productModal === 'create' ? createAPI() : updateAPI(productModal.id)
```

**shopModal 双态**：同上，`'create'` vs `'edit'`
```js
setShopModal('create')
setShopForm({ shopName: '', description: '' })
// 或
setShopModal('edit')
setShopForm({ shopName: shop.shopName, description: shop.description || '' })
```

**ProductImagePreview 组件**（本地组件，在 Dashboard.jsx 文件内）：
```jsx
function ProductImagePreview({ url }) {
  const [error, setError] = useState(false)
  if (!url || error) return <span className="text-text-secondary text-xs font-mono">Img</span>
  return <img src={url} alt="preview" className="w-full h-full object-cover" onError={() => setError(true)} />
}
```

---

## 六、API 路由速查

### 公开
| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/api/shops` | 无 | 店铺列表（含 _count.products） |
| GET | `/api/shops/:id` | 无 | 店铺详情 |
| GET | `/api/products?shopId=` | 无 | 某店铺商品列表 |
| GET | `/api/products/:id` | 无 | 商品详情（含 shop 关联） |
| POST | `/api/orders` | 需要 | `{productId, quantity}` → 返回 `{message, order, user}` |

### Auth
| 方法 | 路径 | Body |
|------|------|------|
| POST | `/api/auth/register` | `{username, password, role:'merchant'|'user'}` |
| POST | `/api/auth/login` | `{username, password}` → `{token, user}` |

### Admin
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users?search=&role=` | 用户列表 |
| PUT | `/api/admin/users/:id` | 编辑用户 |
| DELETE | `/api/admin/users/:id` | 删除用户 |
| POST | `/api/admin/top-up` | `{userId, amount}` |
| GET | `/api/admin/orders` | 全部订单 |
| DELETE | `/api/admin/orders/:id` | 删除订单 |

### Merchant
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/merchant/shop` | 我的店铺（无店铺返回 null） |
| POST | `/api/merchant/shop` | `{shopName, description?}` 创建店铺 |
| PUT | `/api/merchant/shop` | `{shopName?, description?}` 更新店铺 |
| GET | `/api/merchant/products` | 我的商品列表（price 已序列化） |
| POST | `/api/merchant/products` | `{productName, description?, price, imageUrl?}` 上架 |
| PUT | `/api/merchant/products/:id` | `{productName?, description?, price?, imageUrl?, status?}` 编辑 |
| DELETE | `/api/merchant/products/:id` | 下架商品 |
| GET | `/api/merchant/orders` | 销售记录 |

### User
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/user/orders` | 我的订单 |
| GET | `/api/user/balance` | 我的余额 |

---

## 七、路由页面速查

| 路径 | 页面 | 需要角色 |
|------|------|----------|
| `/login` | Login | 未登录 |
| `/register` | Register | 未登录 |
| `/` | Home (店铺列表 + 逛商场入口) | user, admin |
| `/shop/:id` | ShopDetail (商品列表含缩略图) | user, admin |
| `/product/:id` | ProductDetail (大图/购买弹窗) | user, admin |
| `/explore` | Explore (随机商品网格) | user, admin |
| `/admin` | AdminDashboard | admin |
| `/merchant` | MerchantDashboard | merchant |
| `/user/orders` | UserOrders | user |
| `/user/balance` | UserBalance | user |

---

## 八、Sidebar 导航链接

```js
userLinks: [
  { to: '/', label: 'Shops' },
  { to: '/explore', label: 'Explore' },
  { to: '/user/orders', label: 'Orders' },
  { to: '/user/balance', label: 'Balance' },
]
```

---

## 九、开发工作流

1. **添加新页面**：创建 `pages/xxx/NamedPage.jsx` → 在 `App.jsx` 加路由 → 如需要侧边栏导航，在对应 Sidebar links 添加
2. **添加新 API**：创建路由文件 `routes/xxx.js` → 在 `index.js` 注册 `app.use('/api/xxx', xxxRoutes)`
3. **修改数据库**：编辑 `prisma/schema.prisma` → 运行 `npx prisma db push`（或 `npx prisma migrate dev`）
4. **添加 UI 组件**：放在 `components/ui/`，默认导出，遵循项目色彩/间距/动效规范
5. **添加 Store**：放在 `stores/`，用 Zustand `create()`，保持轻量
6. **商户表单添加字段**：在 `productForm` 初始值 / `openCreateProduct` / `openEditProduct` 三处同步添加

---

## 十、禁止事项

- ❌ 不要引入 Ant Design、MUI、shadcn/ui 等第三方 UI 库
- ❌ 不要在 JSX 中直接写 `#0D0D0D` 等硬编码颜色，必须用 Tailwind 语义类名
- ❌ 不要使用 CSS `box-shadow`、`gradient`（违反极简无阴影/无渐变原则）
- ❌ 不要使用 spinner 动画，加载态一律用 Skeleton 组件
- ❌ 不要在服务端直接返回 Prisma Decimal 对象，必须 `.toString()`
- ❌ 不要在前端 import 时使用 `@/` 别名，使用相对路径 `../` 或 `../../`
- ❌ 不要修改 `server/.env` 中与 docker-compose.yml 对应的数据库密码（保持 `password` 一致）
- ❌ 不要添加项目级别的注释，保持代码干净
- ❌ 不要在商品列表中把 `imageUrl` 显示为链接文本，必须渲染为 `<img>` 缩略图
- ❌ 不要用 `prompt()` 做表单输入，必须用 Modal + Input/textarea

---

## 十一、启动命令

```bash
# MySQL
docker compose up -d

# 后端
cd server && npm run dev      # → localhost:3001

# 前端
cd client && npm run dev       # → localhost:5173

# 构建
cd client && npm run build     # → client/dist/
```

---

## 十二、测试账号

| 账号 | 密码 | 角色 | 余额 |
|------|------|------|------|
| `admin` | `admin123` | 管理员 | 999,999 |
| `merchant01` | `merchant123` | 商户（法拉利旗舰店） | 0 |
| `buyer01` | `user123` | 买家 | 1,000,000 |

---

以上是你对该项目需要知道的一切。当被调用时，直接基于这些上下文工作，无需用户再次说明。
