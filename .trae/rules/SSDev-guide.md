# SSDev-guide — ShopSimulator 项目开发指南

> **激活方式**：当用户在对话中 `@SSDev-guide` 时，直接基于本文档掌握项目全貌，无需重新扫描或询问基础信息。
> 
> **更新策略**：任何 API 修改、数据库模型变更、路由变更、组件库变更等，都需同步更新本文档。

---

## 1. 项目概述

ShopSimulator 是一个全栈虚拟电商平台，支持三类角色：
- **admin**：管理员，可管理用户、订单、充值
- **merchant**：商户，可管理自有店铺和商品
- **user**：普通用户，可浏览商品、下单购买

---

## 2. 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.3.1 | UI 框架 |
| Vite | ^6.0.1 | 构建工具 / 开发服务器 |
| TailwindCSS | ^3.4.15 | 原子化 CSS 框架 |
| Zustand | ^5.0.1 | 轻量状态管理 |
| React Router | ^6.28.0 | 前端路由 |
| Axios | ^1.7.7 | HTTP 请求客户端 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | — | 运行时 |
| Express | ^4.21.1 | Web 框架 |
| Prisma | ^5.22.0 | ORM |
| MySQL | — | 关系型数据库 |
| jsonwebtoken | ^9.0.2 | JWT 令牌签发与验证 |
| bcryptjs | ^2.4.3 | 密码哈希 |

---

## 3. 完整目录结构

### 项目根目录
```
shopsimulator/
├── client/                  # 前端项目 (Vite + React)
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # Axios 实例 + 拦截器
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx      # 主布局容器 (Sidebar + TopBar + main)
│   │   │   │   ├── Sidebar.jsx     # 侧边导航栏（按角色显示不同菜单）
│   │   │   │   └── TopBar.jsx      # 顶部栏（主题切换、余额、登出）
│   │   │   ├── shared/
│   │   │   │   └── ProtectedRoute.jsx  # 路由守卫（JWT + 角色校验）
│   │   │   └── ui/
│   │   │       ├── Badge.jsx       # 状态标签组件
│   │   │       ├── Button.jsx      # 按钮组件（4 种变体）
│   │   │       ├── Card.jsx        # 卡片容器组件
│   │   │       ├── Input.jsx       # 输入框组件
│   │   │       ├── Modal.jsx       # 模态框组件
│   │   │       └── Skeleton.jsx    # 骨架屏加载组件
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.jsx   # 管理员仪表盘
│   │   │   ├── merchant/
│   │   │   │   └── Dashboard.jsx   # 商户仪表盘
│   │   │   ├── user/
│   │   │   │   ├── Balance.jsx     # 用户余额页
│   │   │   │   └── Orders.jsx      # 用户订单页
│   │   │   ├── Explore.jsx         # 随机商品探索页
│   │   │   ├── Home.jsx            # 首页（店铺列表）
│   │   │   ├── Login.jsx           # 登录页
│   │   │   ├── ProductDetail.jsx   # 商品详情页
│   │   │   ├── Register.jsx        # 注册页
│   │   │   └── ShopDetail.jsx      # 店铺详情页
│   │   ├── stores/
│   │   │   ├── authStore.js        # 认证状态（token、user、登录、登出）
│   │   │   ├── orderStore.js       # 订单列表状态
│   │   │   └── productStore.js     # 商品列表状态
│   │   ├── styles/
│   │   │   └── globals.css         # 全局样式 + CSS 变量 + 暗黑/亮色主题
│   │   ├── App.jsx                 # 路由定义（所有页面路由+角色限制）
│   │   └── main.jsx                # 应用入口（BrowserRouter + 主题初始化）
│   ├── index.html
│   ├── vite.config.js              # Vite 配置（端口 5173，API 代理到 :3001）
│   ├── tailwind.config.js          # Tailwind 配置（8px 栅格、自定义色卡、动效）
│   └── package.json
├── server/
│   ├── prisma/
│   │   ├── schema.prisma           # 数据库模型定义
│   │   └── seed.js                 # 种子数据（admin/merchant01/buyer01 + 店铺 + 商品）
│   └── src/
│       ├── middleware/
│       │   └── auth.js             # JWT 验证中间件 + 角色校验中间件
│       ├── routes/
│       │   ├── admin.js            # 管理员路由（用户管理、充值、订单查询）
│       │   ├── auth.js             # 认证路由（注册、登录）
│       │   ├── merchant.js         # 商户路由（店铺/商品 CRUD、销售记录）
│       │   ├── public.js           # 公开路由（店铺/商品浏览、下单）
│       │   └── user.js             # 用户路由（个人订单、余额）
│       ├── index.js                # Express 入口（路由挂载、Prisma 注入、CORS）
│       └── package.json
├── docker-compose.yml
└── README.md
```

---

## 4. API 路由表（完整）

### 认证路由 — `/api/auth` (无需认证)
| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| POST | `/api/auth/register` | 用户注册 | `{ username, password, role }` — role: `merchant` 或 `user` |
| POST | `/api/auth/login` | 用户登录 | `{ username, password }` |

> 注册/登录成功返回：`{ message, token, user: { id, username, role, balance } }`  
> balance 为字符串格式的 Decimal

### 管理员路由 — `/api/admin` (需 admin 角色)
| 方法 | 路径 | 说明 | 请求体 / 参数 |
|------|------|------|-------------|
| GET | `/api/admin/users` | 用户列表 | Query: `?search=&role=` |
| PUT | `/api/admin/users/:id` | 编辑用户 | `{ username?, role? }` |
| DELETE | `/api/admin/users/:id` | 删除用户 | —（不能删除 admin） |
| POST | `/api/admin/top-up` | 用户充值 | `{ userId, amount }` — amount 上限 999,999,999 |
| GET | `/api/admin/orders` | 所有订单列表 | — |
| DELETE | `/api/admin/orders/:id` | 删除订单 | — |

### 商户路由 — `/api/merchant` (需 merchant 角色)
| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| POST | `/api/merchant/shop` | 创建店铺 | `{ shopName, description? }` — 每商户仅一店 |
| PUT | `/api/merchant/shop` | 更新店铺 | `{ shopName?, description? }` |
| GET | `/api/merchant/shop` | 获取自有店铺 | — |
| GET | `/api/merchant/products` | 商品列表 | —（仅自有商品） |
| POST | `/api/merchant/products` | 上架商品 | `{ productName, description?, price, imageUrl? }` |
| PUT | `/api/merchant/products/:id` | 编辑商品 | `{ productName?, description?, price?, imageUrl?, status? }` |
| DELETE | `/api/merchant/products/:id` | 下架商品 | — |
| GET | `/api/merchant/orders` | 销售记录 | —（仅自有店铺订单） |

### 用户路由 — `/api/user` (需 user 角色)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/user/orders` | 用户订单列表 |
| GET | `/api/user/balance` | 查询余额 |

### 公开路由 — `/api` (混合权限)
| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/api/shops` | 店铺列表 | 公开 |
| GET | `/api/shops/:id` | 店铺详情 | 公开 |
| GET | `/api/products` | 商品列表 | 公开，Query: `?shopId=` |
| GET | `/api/products/random` | 随机商品 | 公开，Query: `?count=` (默认 8，1-50) |
| GET | `/api/products/:id` | 商品详情 | 公开 |
| POST | `/api/orders` | 下单购买 | 需认证（任意角色），body: `{ productId, quantity? }` |

### 健康检查
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 返回 `{ status: 'ok', timestamp }` |

---

## 5. 前端路由表

| 路径 | 页面组件 | 允许角色 | 说明 |
|------|---------|---------|------|
| `/login` | Login | 未登录用户（已登录自动跳转） | 登录页 |
| `/register` | Register | 未登录用户（已登录自动跳转） | 注册页 |
| `/` | Home | user, admin | 首页 — 店铺列表 |
| `/shop/:id` | ShopDetail | user, admin | 店铺详情 |
| `/product/:id` | ProductDetail | user, admin | 商品详情 |
| `/explore` | Explore | user, admin | 随机商品探索 |
| `/admin` | AdminDashboard | admin | 管理员仪表盘 |
| `/merchant` | MerchantDashboard | merchant | 商户仪表盘 |
| `/user/orders` | UserOrders | user | 我的订单 |
| `/user/balance` | UserBalance | user | 我的余额 |
| `*` | — | — | 重定向到角色默认页 |

> **默认跳转规则**（已登录用户访问 `/login` 或 `/register` 时）：
> - admin → `/admin`
> - merchant → `/merchant`
> - user → `/`

---

## 6. 数据库模型

### User（用户表 → `users`）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, autoincrement | 主键 |
| username | String | unique, VarChar(50) | 用户名 |
| password | String | VarChar(255) | bcrypt 哈希密码 |
| role | String | VarChar(20) | `admin` / `merchant` / `user` |
| balance | Decimal | DECIMAL(12,2), default 0.00 | 账户余额 |
| createdAt | DateTime | default now(), map: created_at | 创建时间 |

**关系**：
- `shops` — 一对多 → Shop（商户拥有的店铺）
- `orders` — 一对多 → Order（"UserOrders"，用户的订单）

### Shop（店铺表 → `shops`）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, autoincrement | 主键 |
| merchantId | Int | map: merchant_id | 商户 ID（FK → User） |
| shopName | String | VarChar(100), map: shop_name | 店铺名称 |
| description | String? | Text | 店铺描述 |
| createdAt | DateTime | default now(), map: created_at | 创建时间 |

**关系**：
- `merchant` — 多对一 → User（所有者）
- `products` — 一对多 → Product（商品）
- `orders` — 一对多 → Order（"ShopOrders"，店铺收到的订单）

### Product（商品表 → `products`）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, autoincrement | 主键 |
| shopId | Int | map: shop_id | 所属店铺 ID（FK → Shop） |
| productName | String | VarChar(100), map: product_name | 商品名称 |
| description | String? | Text | 商品描述 |
| price | Decimal | DECIMAL(12,2) | 价格 |
| imageUrl | String? | VarChar(255), map: image_url | 图片链接 |
| status | String | VarChar(20), default "active" | 状态：`active` / `inactive` |
| createdAt | DateTime | default now(), map: created_at | 创建时间 |

**关系**：
- `shop` — 多对一 → Shop（所属店铺）
- `orders` — 一对多 → Order（包含此商品的订单）

### Order（订单表 → `orders`）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, autoincrement | 主键 |
| userId | Int | map: user_id | 买家 ID（FK → User） |
| productId | Int | map: product_id | 商品 ID（FK → Product） |
| shopId | Int | map: shop_id | 店铺 ID（FK → Shop） |
| quantity | Int | default 1 | 购买数量 |
| totalPrice | Decimal | DECIMAL(12,2), map: total_price | 交易总额 |
| createdAt | DateTime | default now(), map: created_at | 下单时间 |

**关系**：
- `user` — 多对一 → User（"UserOrders"，买家）
- `product` — 多对一 → Product（商品）
- `shop` — 多对一 → Shop（"ShopOrders"，所属店铺）

---

## 7. API 封装方式 (client/src/api/index.js)

**Axios 实例配置**：
- `baseURL`: `/api`
- `timeout`: 10000ms

**请求拦截器**：
- 从 `useAuthStore.getState().token` 获取 JWT
- 自动附加 `Authorization: Bearer <token>` 请求头

**响应拦截器**：
- 成功响应直接返回
- 401 错误：自动调用 `useAuthStore.getState().logout()` 清除认证状态，然后跳转到 `/login`

> **重要**：token 存储在 localStorage，key 为 `shopsimulator_token`；用户信息 key 为 `shopsimulator_user`。主题 key 为 `shopsimulator_theme`。

---

## 8. 状态管理 (client/src/stores/)

### authStore — `useAuthStore`
```
token: string | null          — JWT 令牌
user: object | null           — { id, username, role, balance }
setAuth(token, user)          — 登录后保存认证信息到 state + localStorage
logout()                      — 清除认证信息（state + localStorage）
```
- localStorage key: `shopsimulator_token`, `shopsimulator_user`
- 初始化时从 localStorage 恢复状态

### orderStore — `useOrderStore`
```
orders: array                 — 订单列表
loading: boolean              — 加载状态
error: string | null          — 错误信息
setOrders(orders)             — 设置订单列表
setLoading(loading)           — 设置加载状态
setError(error)               — 设置错误信息
clear()                       — 重置所有状态
```

### productStore — `useProductStore`
```
products: array               — 商品列表
loading: boolean              — 加载状态
error: string | null          — 错误信息
setProducts(products)         — 设置商品列表
setLoading(loading)           — 设置加载状态
setError(error)               — 设置错误信息
clear()                       — 重置所有状态
```

---

## 9. UI 组件库 (client/src/components/ui/)

### Badge
```jsx
<Badge variant="default|active|warning|error" className="">
  {children}
</Badge>
```
- 内联标签，带半透明彩色背景和边框
- `active`：强调绿色系，`warning`：橙色系，`error`：红色系

### Button
```jsx
<Button
  variant="primary|secondary|danger|ghost"
  size="sm|md|lg"
  disabled={false}
  type="button"
  onClick={handler}
  className=""
>
  {children}
</Button>
```
- `primary`：bg-accent 实心，`secondary`：边框 outline，`danger`：橙色边框+hover填充，`ghost`：纯文字
- 尺寸 sm(8px高) / md(10px高) / lg(12px高)
- 所有按钮 150ms ease-out 过渡

### Card
```jsx
<Card hover={false} onClick={handler} className="">
  {children}
</Card>
```
- `hover={true}` 时：hover 边框颜色变为 accent
- 有 onClick 时自动 cursor-pointer

### Input
```jsx
<Input
  label="标签"
  type="text"
  placeholder="占位"
  value={value}
  onChange={handler}
  error="错误信息"
  className=""
/>
```
- 聚焦时：`outline-none + border-accent`（荧光绿边框）
- 错误时：`border-error` + 下方显示红色错误文字
- 高度固定 `h-5`（40px），使用 `font-mono`

### Modal
```jsx
<Modal isOpen={open} onClose={handler} title="标题" size="sm|md|lg">
  {children}
</Modal>
```
- 深色遮罩（bg-black/70），ESC 关闭
- 打开时锁定 body 滚动

### Skeleton
```jsx
<Skeleton className="" style={{}} />
<SkeletonLine width="100%" />
<SkeletonCard />
<SkeletonTable rows={5} cols={4} />
```
- 骨架屏组件，带 `animate-skeleton` 呼吸动画（1.5s ease-in-out）
- `SkeletonLine`：单行骨架
- `SkeletonCard`：模拟卡片布局
- `SkeletonTable`：模拟表格布局

---

## 10. 设计规范

### 色彩体系
| 用途 | 暗黑模式 | 亮色模式 |
|------|---------|---------|
| 主背景 | `#0D0D0D` | `#F5F5F5` |
| 卡片/面板 | `#1A1A1A` | `#FFFFFF` |
| 边框 | `#2A2A2A` | `#E0E0E0` |
| 主文字 | `#E5E5E5` | `#1A1A1A` |
| 辅助文字 | `#888888` | `#666666` |
| 强调色（绿） | `#00FF88` | `#00CC66` |
| 辅助强调（橙） | `#FF6B35` | `#E55A2B` |
| 成功 | `#00FF88` | `#00CC66` |
| 错误 | `#FF4444` | `#DD3333` |

### 字体
- **代码/数字**：`JetBrains Mono`, Consolas, monospace
- **标题/正文**：`Inter`, SF Pro Display, sans-serif
- 数字金额统一使用 `font-mono`

### 布局
- 8px 栅格系统：Tailwind spacing `1`=8px, `2`=16px, `3`=24px...
- 圆角：`sm`=4px, `DEFAULT`=6px, `lg`=8px
- 充足留白，卡片式设计，无冗余装饰元素

### 动效
- hover/active 统一 150ms ease-out 过渡
- 路由切换无动画，直接替换
- 加载状态使用骨架屏（Skeleton 组件）
- 骨架屏呼吸动画：1.5s ease-in-out，opacity 在 0.3 ~ 0.6 间变化

### 组件风格
- **Button**：无圆角到微圆角（rounded-sm/rounded），primary 实心绿色
- **Input**：聚焦时边框变荧光绿（border-accent），`outline-none`
- **Card**：hover 时边框变荧光绿（hover:border-accent）
- **Badge**：半透明背景 + 同色系边框

### 双主题支持
- 暗黑模式：`<html class="dark">`（默认）
- 亮色模式：`<html class="light">`
- 主题通过 CSS 变量切换，TopBar 中提供切换按钮
- 主题偏好存储在 localStorage key `shopsimulator_theme`
- main.jsx 在初始化时恢复主题

---

## 11. 开发约定

### 代码风格
- 新增代码保持与现有文件一致的风格（缩进、命名、文件结构）
- 前端组件使用函数式组件 + export default
- 后端使用 ES Module（`"type": "module"`）
- API 路由使用 Express Router
- Prisma 客户端通过 `req.app.locals.prisma` 注入

### API 开发
- 新增或修改 API 后，**必须同步更新本规则文件的第 4 节 API 路由表**
- 前后端字段名使用 camelCase（数据库使用 snake_case，Prisma 映射）
- balance、price、totalPrice 等 Decimal 字段在 API 响应中统一转为字符串

### 数据库操作
- **涉及金额的操作（如下单、充值）必须使用 Prisma 事务**
- 金额字段统一使用 `DECIMAL(12,2)`
- 使用 `$transaction(async (tx) => {...})` 确保数据一致性

### 认证
- JWT token 存储在 localStorage，key 为 `shopsimulator_token`
- 用户信息存储在 localStorage，key 为 `shopsimulator_user`
- 请求通过 Axios 拦截器自动携带 `Bearer <token>`
- 401 响应自动触发登出并跳转登录页
- JWT 有效期 7 天，payload 含 `{ id, username, role }`

### 中间件链
- `authenticate`：验证 JWT，解析后写入 `req.user`
- `requireRole(...roles)`：校验角色，不在列表返回 403

### Vite 代理
- 开发时 Vite（:5173）代理 `/api` 到后端（:3001）
- 生产环境由 Nginx 或类似方案处理

### 种子数据
- admin / admin123（管理员，余额 999,999）
- merchant01 / merchant123（商户，拥有"法拉利旗舰店"及 5 款商品）
- buyer01 / user123（普通用户，余额 1,000,000）

---

## 12. 启动说明

```bash
# 后端
cd server
npm install
npm run db:push    # 同步数据库
npm run db:seed    # 填充种子数据
npm run dev        # 启动后端（默认 :3001）

# 前端
cd client
npm install
npm run dev        # 启动前端（默认 :5173）
```

---

> **本文档最后更新时间**：2026-05-08  
> **维护说明**：任何代码变更涉及本文档记录的内容，请同步更新对应章节。
