# ShopSimulator

极简模拟购物平台 —— 一个自娱自乐的全栈模拟购物项目。用户可扮演管理员、商户、买家三种角色，自由创建商品并完成虚拟交易。

## 技术栈

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
| 数据库 | MySQL | 8.0+ |
| 认证 | JWT + bcryptjs | ^9.0.2 / ^2.4.3 |

## 项目结构

```
shopsimulator/
├── client/                          # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js             # Axios 实例 + 请求/响应拦截器
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx       # 主布局容器 (Sidebar + TopBar)
│   │   │   │   ├── Sidebar.jsx      # 侧边导航栏（按角色菜单）
│   │   │   │   └── TopBar.jsx       # 顶部栏（主题切换、余额、登出）
│   │   │   ├── shared/
│   │   │   │   └── ProtectedRoute.jsx  # 路由守卫（JWT + 角色校验）
│   │   │   └── ui/
│   │   │       ├── Badge.jsx        # 状态标签
│   │   │       ├── Button.jsx       # 按钮（4 种变体）
│   │   │       ├── Card.jsx         # 卡片容器
│   │   │       ├── Input.jsx        # 输入框
│   │   │       ├── Modal.jsx        # 模态框
│   │   │       └── Skeleton.jsx     # 骨架屏加载
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── Dashboard.jsx    # 管理员仪表盘
│   │   │   ├── merchant/
│   │   │   │   └── Dashboard.jsx    # 商户仪表盘
│   │   │   ├── user/
│   │   │   │   ├── Balance.jsx      # 用户余额页
│   │   │   │   └── Orders.jsx       # 用户订单页
│   │   │   ├── Explore.jsx          # 随机商品探索
│   │   │   ├── Home.jsx             # 首页（店铺列表）
│   │   │   ├── Login.jsx            # 登录页
│   │   │   ├── ProductDetail.jsx    # 商品详情
│   │   │   ├── Register.jsx         # 注册页
│   │   │   └── ShopDetail.jsx       # 店铺详情
│   │   ├── stores/
│   │   │   ├── authStore.js         # 认证状态（token、user）
│   │   │   ├── orderStore.js        # 订单状态
│   │   │   └── productStore.js      # 商品状态
│   │   ├── styles/
│   │   │   └── globals.css          # 全局样式 + CSS 变量 + 双主题
│   │   ├── App.jsx                  # 路由定义
│   │   └── main.jsx                 # 应用入口
│   ├── tailwind.config.js           # 8px 栅格、自定义色卡、动效
│   ├── vite.config.js               # Vite 配置（:5173，代理 :3001）
│   └── package.json
├── server/                          # 后端项目 (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma            # 数据模型（User/Shop/Product/Order）
│   │   └── seed.js                  # 种子数据
│   └── src/
│       ├── middleware/
│       │   └── auth.js              # JWT 验证 + 角色校验中间件
│       ├── routes/
│       │   ├── admin.js             # 管理员路由
│       │   ├── auth.js              # 认证路由（注册/登录）
│       │   ├── merchant.js          # 商户路由（店铺/商品 CRUD）
│       │   ├── public.js            # 公开路由（浏览/下单）
│       │   └── user.js              # 用户路由（订单/余额）
│       ├── index.js                 # Express 入口
│       └── package.json
├── docs/
│   └── PROJECT.md                   # 完整项目结构与功能说明
├── docker-compose.yml               # MySQL 8.0 容器
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18
- Docker Desktop（推荐）或本地 MySQL >= 8.0

> **推荐使用 Docker**：无需手动安装 MySQL，一行命令搞定。

---

### 方式一：Docker 启动 MySQL（推荐）

#### 1. 启动 MySQL 容器

```bash
# 在项目根目录下运行
docker compose up -d
```

这会自动拉取 MySQL 8.0 镜像，创建 `shopsimulator` 数据库，并挂载数据卷持久化数据。

常用 Docker 命令：

```bash
docker compose up -d      # 后台启动
docker compose down       # 停止并删除容器
docker compose down -v    # 停止并删除容器+数据卷（清空数据库）
docker compose ps         # 查看运行状态
```

`.env` 文件已预配置好，无需修改：

```
DATABASE_URL="mysql://root:password@localhost:3306/shopsimulator"
JWT_SECRET="shopsimulator_jwt_secret_key_2026"
PORT=3001
```

#### 2. 安装依赖

```bash
cd server && npm install
cd ../client && npm install
```

#### 3. 初始化数据库

```bash
cd server
npx prisma db push       # 推送 Schema 到数据库
npm run db:seed           # 导入种子数据（可选）
```

#### 4. 启动项目

```bash
cd server && npm run dev    # 后端 → http://localhost:3001
cd ../client && npm run dev  # 前端 → http://localhost:5173
```

---

### 方式二：本地 MySQL（如果已安装）

<details>
<summary>点击展开本地 MySQL 配置</summary>

#### 1. 创建数据库

```sql
CREATE DATABASE shopsimulator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2. 修改 `.env`

```
DATABASE_URL="mysql://root:你的密码@localhost:3306/shopsimulator"
```

#### 3. 安装依赖 → 初始化 → 启动

同方式一的步骤 2-4。

</details>

---

> **种子数据**（`npm run db:seed` 导入）：
> | 账号 | 密码 | 角色 |
> |------|------|------|
> | `admin` | `admin123` | 管理员 |
> | `merchant01` | `merchant123` | 商户（法拉利旗舰店 + 5 个商品） |
> | `buyer01` | `user123` | 买家（余额 1,000,000） |

## 角色与功能

### 管理员 (Admin)
- 查看/搜索/编辑/删除所有用户
- 给任意用户充值（打钱）
- 查看/删除所有订单
- 浏览店铺列表

### 商户 (Merchant)
- 创建/编辑店铺信息
- 商品管理（上架/编辑/下架/删除）
- 查看销售记录
- 查看账户余额

### 用户 (User)
- 浏览所有店铺和商品
- 购买商品（扣款 + 自动给商户加款）
- 查看购买记录
- 查看账户余额

## API 文档

### 认证接口 — `/api/auth`

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| POST | `/api/auth/register` | 注册 `{username, password, role}` | 无需认证 |
| POST | `/api/auth/login` | 登录 `{username, password}` → JWT | 无需认证 |

### 公开接口 — `/api`

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET | `/api/shops` | 店铺列表 | 无需认证 |
| GET | `/api/shops/:id` | 店铺详情 | 无需认证 |
| GET | `/api/products` | 商品列表 `?shopId=` | 无需认证 |
| GET | `/api/products/random` | 随机商品 `?count=`（默认 8） | 无需认证 |
| GET | `/api/products/:id` | 商品详情 | 无需认证 |
| POST | `/api/orders` | 下单购买 `{productId, quantity}` | 需认证 |

### 管理员接口 — `/api/admin`

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET | `/api/admin/users` | 用户列表 `?search=&role=` | admin |
| PUT | `/api/admin/users/:id` | 编辑用户 `{username?, role?}` | admin |
| DELETE | `/api/admin/users/:id` | 删除用户 | admin |
| POST | `/api/admin/top-up` | 充值 `{userId, amount}` | admin |
| GET | `/api/admin/orders` | 全部订单 | admin |
| DELETE | `/api/admin/orders/:id` | 删除订单 | admin |

### 商户接口 — `/api/merchant`

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET | `/api/merchant/shop` | 我的店铺 | merchant |
| POST | `/api/merchant/shop` | 创建店铺 `{shopName, description?}` | merchant |
| PUT | `/api/merchant/shop` | 更新店铺 | merchant |
| GET | `/api/merchant/products` | 我的商品 | merchant |
| POST | `/api/merchant/products` | 上架商品 `{productName, price, ...}` | merchant |
| PUT | `/api/merchant/products/:id` | 编辑商品 | merchant |
| DELETE | `/api/merchant/products/:id` | 下架商品 | merchant |
| GET | `/api/merchant/orders` | 销售记录 | merchant |

### 用户接口 — `/api/user`

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET | `/api/user/orders` | 我的订单 | user |
| GET | `/api/user/balance` | 我的余额 | user |

### 健康检查

| 方法 | 路径 | 说明 | 角色 |
|------|------|------|------|
| GET | `/api/health` | 服务状态 | 无需认证 |

## 数据库表结构

- `users` — 用户表（含角色、余额）
- `shops` — 店铺表（关联商户）
- `products` — 商品表（关联店铺）
- `orders` — 订单表（关联用户、商品、店铺）

## 核心购买流程

1. 用户选择商品 → 点击 `+` 按钮
2. 后端验证：商品状态、余额检查、事务操作
3. 扣减用户余额 + 增加商户余额 + 生成订单
4. 原子事务保证数据一致性

## 设计特色

- **极简主义 + 极客审美**：深黑底色 + 荧光绿强调色
- **暗黑/亮色双主题**：点击 TopBar 的 ☀/☾ 切换
- **骨架屏加载**：数据加载时展示 Skeleton 替代 Spinner
- **微交互**：hover 150ms ease-out 过渡，点击即时反馈
- **等宽字体**：价格等数据统一使用 JetBrains Mono

## 生产部署

```bash
# 前端构建
cd client
npm run build      # 输出到 dist/

# 后端启动
cd server
NODE_ENV=production npm start
```

将 `client/dist/` 部署到静态服务器（Nginx / Vercel），后端使用 PM2 或 Docker 部署。

## 测试回归清单

- [x] 注册 → 登录 → 按角色正确跳转
- [x] 管理员打钱 → 用户余额增加
- [x] 用户购买 → 余额扣减 → 订单生成 → 商户余额增加
- [x] 商户上架 → 首页可见
- [x] 暗黑/亮色模式切换正常
- [x] 路由守卫按角色正确拦截
