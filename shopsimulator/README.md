# ShopSimulator

极简模拟购物平台 —— 一个自娱自乐的全栈模拟购物项目。用户可扮演管理员、商户、买家三种角色，自由创建商品并完成虚拟交易。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + Tailwind CSS + Zustand + Axios + React Router v6 |
| 后端 | Node.js + Express + Prisma ORM + JWT + bcrypt |
| 数据库 | MySQL |

## 项目结构

```
shopsimulator/
├── client/                 # 前端 (React + Vite)
│   ├── src/
│   │   ├── api/            # Axios 封装
│   │   ├── components/     # 组件
│   │   │   ├── ui/         # 基础 UI 原子组件
│   │   │   ├── layout/     # 布局组件
│   │   │   └── shared/     # 公用组件
│   │   ├── pages/          # 页面
│   │   │   ├── admin/      # 管理员后台
│   │   │   ├── merchant/   # 商户后台
│   │   │   └── user/       # 用户页面
│   │   ├── stores/         # Zustand 状态
│   │   └── styles/         # 全局样式 & CSS 变量
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # 后端 (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma   # 数据模型
│   │   └── seed.js         # 种子数据
│   └── src/
│       ├── middleware/      # JWT 认证中间件
│       └── routes/         # API 路由
├── docker-compose.yml      # MySQL 容器配置
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

### 认证模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 `{username, password, role}` |
| POST | `/api/auth/login` | 登录 `{username, password}` → JWT |

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/shops` | 店铺列表 |
| GET | `/api/shops/:id` | 店铺详情 |
| GET | `/api/products` | 商品列表 `?shopId=` |
| POST | `/api/orders` | 购买 `{productId, quantity}` |

### 管理员接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 用户列表 `?search=&role=` |
| PUT | `/api/admin/users/:id` | 编辑用户 |
| DELETE | `/api/admin/users/:id` | 删除用户 |
| POST | `/api/admin/top-up` | 打钱 `{userId, amount}` |
| GET | `/api/admin/orders` | 全部订单 |
| DELETE | `/api/admin/orders/:id` | 删除订单 |

### 商户接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/merchant/shop` | 我的店铺 |
| POST | `/api/merchant/shop` | 创建店铺 |
| PUT | `/api/merchant/shop` | 更新店铺 |
| GET | `/api/merchant/products` | 我的商品 |
| POST | `/api/merchant/products` | 上架商品 |
| PUT | `/api/merchant/products/:id` | 编辑商品 |
| DELETE | `/api/merchant/products/:id` | 下架商品 |
| GET | `/api/merchant/orders` | 销售记录 |

### 用户接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/user/orders` | 我的订单 |
| GET | `/api/user/balance` | 我的余额 |

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
