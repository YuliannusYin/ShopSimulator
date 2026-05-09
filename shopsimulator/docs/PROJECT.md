# ShopSimulator — 项目结构与功能说明

> 全栈虚拟电商平台，支持 admin（管理员）、merchant（商户）、user（普通用户）三类角色。

---

## 一、项目结构

```
shopsimulator/
├── client/                          # 前端项目 (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js             # Axios 实例 + 请求/响应拦截器
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx       # 主布局容器 (Sidebar + TopBar + main)
│   │   │   │   ├── Sidebar.jsx      # 侧边导航栏（按角色显示不同菜单）
│   │   │   │   └── TopBar.jsx       # 顶部栏（主题切换、余额、登出）
│   │   │   ├── shared/
│   │   │   │   └── ProtectedRoute.jsx  # 路由守卫（JWT 验证 + 角色校验）
│   │   │   └── ui/
│   │   │       ├── Badge.jsx        # 状态标签组件
│   │   │       ├── Button.jsx       # 按钮组件（4 种变体）
│   │   │       ├── Card.jsx         # 卡片容器组件
│   │   │       ├── Input.jsx        # 输入框组件
│   │   │       ├── Modal.jsx        # 模态框组件
│   │   │       └── Skeleton.jsx     # 骨架屏加载组件
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.jsx    # 管理员仪表盘（用户管理+充值+订单）
│   │   │   ├── merchant/
│   │   │   │   └── Dashboard.jsx    # 商户仪表盘（店铺+商品+销售记录）
│   │   │   ├── user/
│   │   │   │   ├── Balance.jsx      # 用户余额页
│   │   │   │   └── Orders.jsx       # 用户订单页
│   │   │   ├── Explore.jsx          # 随机商品探索页
│   │   │   ├── Home.jsx             # 首页（店铺列表）
│   │   │   ├── Login.jsx            # 登录页
│   │   │   ├── ProductDetail.jsx    # 商品详情页
│   │   │   ├── Register.jsx         # 注册页
│   │   │   └── ShopDetail.jsx       # 店铺详情页
│   │   ├── stores/
│   │   │   ├── authStore.js         # 认证状态（token、user、登录、登出）
│   │   │   ├── orderStore.js        # 订单列表状态
│   │   │   └── productStore.js      # 商品列表状态
│   │   ├── styles/
│   │   │   └── globals.css          # 全局样式 + CSS 变量 + 暗黑/亮色主题
│   │   ├── App.jsx                  # 路由定义（所有页面路由+角色限制）
│   │   └── main.jsx                 # 应用入口（BrowserRouter + 主题初始化）
│   ├── index.html
│   ├── vite.config.js               # Vite 配置（端口 5173，API 代理到 :3001）
│   ├── tailwind.config.js           # Tailwind 配置（8px 栅格、自定义色卡、动效）
│   └── package.json
├── server/                          # 后端项目 (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma            # 数据库模型定义（User/Shop/Product/Order）
│   │   └── seed.js                  # 种子数据
│   └── src/
│       ├── middleware/
│       │   └── auth.js              # JWT 验证中间件 + 角色校验中间件
│       ├── routes/
│       │   ├── admin.js             # 管理员路由（用户管理、充值、订单查询）
│       │   ├── auth.js              # 认证路由（注册、登录）
│       │   ├── merchant.js          # 商户路由（店铺/商品 CRUD、销售记录）
│       │   ├── public.js            # 公开路由（店铺/商品浏览、下单）
│       │   └── user.js              # 用户路由（个人订单、余额）
│       ├── index.js                 # Express 入口（路由挂载、Prisma 注入、CORS）
│       └── package.json
├── docker-compose.yml               # Docker 编排（MySQL + App）
└── README.md
```

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | ^18.3.1 |
| 构建工具 | Vite | ^6.0.1 |
| CSS 框架 | TailwindCSS | ^3.4.15 |
| 状态管理 | Zustand | ^5.0.1 |
| 路由 | React Router | ^6.28.0 |
| HTTP 客户端 | Axios | ^1.7.7 |
| 后端框架 | Express | ^4.21.1 |
| ORM | Prisma | ^5.22.0 |
| 数据库 | MySQL | — |
| 认证 | JWT + bcryptjs | ^9.0.2 / ^2.4.3 |

---

## 二、数据库表结构

### User（用户表 → `users`）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, 自增 | 主键 |
| username | String | unique, VarChar(50) | 用户名 |
| password | String | VarChar(255) | bcrypt 哈希密码 |
| role | String | VarChar(20) | 角色：`admin` / `merchant` / `user` |
| balance | Decimal | DECIMAL(12,2), 默认 0.00 | 账户余额 |
| createdAt | DateTime | 默认 now() | 创建时间 |

### Shop（店铺表 → `shops`）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, 自增 | 主键 |
| merchantId | Int | FK → User | 商户 ID |
| shopName | String | VarChar(100) | 店铺名称 |
| description | String? | Text | 店铺描述 |
| createdAt | DateTime | 默认 now() | 创建时间 |

### Product（商品表 → `products`）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, 自增 | 主键 |
| shopId | Int | FK → Shop | 所属店铺 ID |
| productName | String | VarChar(100) | 商品名称 |
| description | String? | Text | 商品描述 |
| price | Decimal | DECIMAL(12,2) | 价格 |
| imageUrl | String? | VarChar(255) | 图片链接 |
| status | String | VarChar(20), 默认 "active" | 状态：`active` / `inactive` |
| createdAt | DateTime | 默认 now() | 创建时间 |

### Order（订单表 → `orders`）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | Int | PK, 自增 | 主键 |
| userId | Int | FK → User | 买家 ID |
| productId | Int | FK → Product | 商品 ID |
| shopId | Int | FK → Shop | 店铺 ID |
| quantity | Int | 默认 1 | 购买数量 |
| totalPrice | Decimal | DECIMAL(12,2) | 交易总额 |
| createdAt | DateTime | 默认 now() | 下单时间 |

### 表关系

```
User (1) ─── (N) Shop        # 商户拥有店铺
User (1) ─── (N) Order       # 用户的订单 (UserOrders)
Shop (1) ─── (N) Product     # 店铺包含商品
Shop (1) ─── (N) Order       # 店铺收到的订单 (ShopOrders)
Product (1) ─── (N) Order    # 商品被订购
```

---

## 三、全部页面路由

| 路径 | 页面名称 | 功能说明 | 所需角色 |
|------|---------|---------|---------|
| `/login` | 登录页 | 用户登录，已登录自动跳转 | 未登录用户 |
| `/register` | 注册页 | 用户注册（选择 merchant 或 user 角色） | 未登录用户 |
| `/` | 首页 | 店铺列表浏览 | user, admin |
| `/shop/:id` | 店铺详情 | 查看店铺信息及商品列表 | user, admin |
| `/product/:id` | 商品详情 | 查看商品信息并下单购买 | user, admin |
| `/explore` | 随机探索 | 随机展示商品供浏览 | user, admin |
| `/admin` | 管理员仪表盘 | 用户管理、充值、订单管理 | admin |
| `/merchant` | 商户仪表盘 | 店铺管理、商品管理、销售记录 | merchant |
| `/user/orders` | 我的订单 | 查看个人订单记录 | user |
| `/user/balance` | 我的余额 | 查看账户余额 | user |
| `*` | 兜底路由 | 重定向到角色默认页 | — |

### 角色默认跳转

| 角色 | 登录后默认页面 | 无权访问时跳转 |
|------|--------------|--------------|
| admin | `/admin` | `/admin` |
| merchant | `/merchant` | `/merchant` |
| user | `/` | `/` |

---

## 四、全部后端 API

### 认证接口 — `/api/auth`

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|---------|
| POST | `/api/auth/register` | 用户注册 | 无需认证 |
| POST | `/api/auth/login` | 用户登录 | 无需认证 |

### 管理员接口 — `/api/admin`

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|---------|
| GET | `/api/admin/users` | 用户列表（支持 search、role 筛选） | admin |
| PUT | `/api/admin/users/:id` | 编辑用户（用户名、角色） | admin |
| DELETE | `/api/admin/users/:id` | 删除用户（不可删除 admin） | admin |
| POST | `/api/admin/top-up` | 用户充值 | admin |
| GET | `/api/admin/orders` | 所有订单列表 | admin |
| DELETE | `/api/admin/orders/:id` | 删除订单 | admin |

### 商户接口 — `/api/merchant`

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|---------|
| POST | `/api/merchant/shop` | 创建店铺（每商户仅一个） | merchant |
| PUT | `/api/merchant/shop` | 更新店铺信息 | merchant |
| GET | `/api/merchant/shop` | 获取自有店铺 | merchant |
| GET | `/api/merchant/products` | 商品列表（仅自有） | merchant |
| POST | `/api/merchant/products` | 上架商品 | merchant |
| PUT | `/api/merchant/products/:id` | 编辑商品 | merchant |
| DELETE | `/api/merchant/products/:id` | 下架商品 | merchant |
| GET | `/api/merchant/orders` | 销售记录（仅自有店铺） | merchant |

### 用户接口 — `/api/user`

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|---------|
| GET | `/api/user/orders` | 个人订单列表 | user |
| GET | `/api/user/balance` | 查询余额 | user |

### 公开接口 — `/api`

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|---------|
| GET | `/api/shops` | 店铺列表 | 无需认证 |
| GET | `/api/shops/:id` | 店铺详情 | 无需认证 |
| GET | `/api/products` | 商品列表（支持 shopId 筛选） | 无需认证 |
| GET | `/api/products/random` | 随机商品（支持 count 参数） | 无需认证 |
| GET | `/api/products/:id` | 商品详情 | 无需认证 |
| POST | `/api/orders` | 下单购买（使用 Prisma 事务） | 需认证 |

### 健康检查

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|---------|
| GET | `/api/health` | 服务健康检查 | 无需认证 |

### 认证与请求规范

- 认证方式：JWT，Header `Authorization: Bearer <token>`
- Token 存储：localStorage key `shopsimulator_token`
- Token 有效期：7 天
- 金额字段（balance、price、totalPrice）在 API 响应中统一为字符串格式
- 涉及金额的操作使用 Prisma `$transaction` 确保数据一致性
- 充值金额上限：999,999,999
- 注册可选角色：`merchant` 或 `user`（admin 无法通过注册产生）

### 种子数据

| 用户名 | 密码 | 角色 | 余额 | 备注 |
|--------|------|------|------|------|
| admin | admin123 | admin | 999,999.00 | 管理员 |
| merchant01 | merchant123 | merchant | 0.00 | 商户，拥有「法拉利旗舰店」及 5 款商品 |
| buyer01 | user123 | user | 1,000,000.00 | 普通用户 |
