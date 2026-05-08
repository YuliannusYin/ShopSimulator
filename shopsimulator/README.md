# ShopSimulator

> 一个自娱自乐的模拟购物平台，支持管理员、商户、用户三种角色，极简暗色界面风格。

---

## ✨ 功能亮点

- 🛒 **完整购物闭环** — 浏览 → 下单 → 扣款 → 订单记录，含 Prisma 原子事务保障
- 🎭 **三种角色** — Admin 后台管理、Merchant 开店上架、User 购物消费，JWT 路由守卫
- 🎨 **极简极客审美** — `#0D0D0D` 暗色底色 + `#00FF88` 荧光绿，暗黑/亮色双主题切换
- 🔀 **逛商场** — 随机商品网格，一键换一批，快速 `+` 购买 + Toast 轻提示
- 🖼 **商品封面** — 支持粘贴图片 URL，表单内实时预览，列表缩略图渲染

---

## 🎮 三种角色

| 角色 | 能力 |
|------|------|
| **Admin** | 管理所有账号（CRUD）、给用户打钱、查看/删除任意订单 |
| **Merchant** | 创建店铺、上架/编辑/下架商品（含封面图）、查看销售记录 |
| **User** | 浏览店铺和商品、一键购买或数量确认购买、查看订单与余额 |

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + Tailwind CSS + Zustand + React Router v6 |
| 后端 | Node.js + Express |
| 数据库 | MySQL + Prisma ORM |
| 认证 | JWT + bcryptjs |

---

## 🚀 本地运行

### 环境要求

- Node.js >= 18
- Docker Desktop（推荐）或本地 MySQL >= 8.0

### 1. 克隆项目

```bash
git clone <repo-url>
cd shopsimulator
```

### 2. 启动数据库

```bash
docker compose up -d
```

### 3. 安装依赖

```bash
cd server && npm install
cd ../client && npm install
```

### 4. 配置环境变量

编辑 `server/.env`：

```env
DATABASE_URL="mysql://root:password@localhost:3306/shopsimulator"
JWT_SECRET="shopsimulator_jwt_secret_key_2026"
PORT=3001
```

### 5. 初始化数据库

```bash
cd server
npx prisma db push
npm run db:seed     # 可选：导入测试数据
```

### 6. 启动项目

```bash
cd server && npm run dev      # 后端 → http://localhost:3001
cd ../client && npm run dev   # 前端 → http://localhost:5173
```

访问 **http://localhost:5173**

---

### 测试账号

| 账号 | 密码 | 角色 |
|------|------|------|
| `admin` | `admin123` | 管理员 |
| `merchant01` | `merchant123` | 商户（法拉利旗舰店） |
| `buyer01` | `user123` | 买家（余额 1,000,000） |

---

## 📸 页面截图

> 截图待补充

---

## 📁 项目结构

```
shopsimulator/
├── client/
│   ├── src/
│   │   ├── api/              # Axios 封装 (JWT 拦截器)
│   │   ├── components/
│   │   │   ├── ui/           # Button / Input / Card / Badge / Modal / Skeleton
│   │   │   ├── layout/       # Layout / Sidebar / TopBar
│   │   │   └── shared/       # ProtectedRoute
│   │   ├── pages/
│   │   │   ├── admin/        # 管理员后台
│   │   │   ├── merchant/     # 商户后台 (店铺 + 商品 CRUD)
│   │   │   └── user/         # 用户订单 / 余额
│   │   ├── stores/           # Zustand (auth / product / order)
│   │   └── styles/           # globals.css (CSS Variables)
│   └── vite.config.js
├── server/
│   ├── prisma/
│   │   ├── schema.prisma     # User / Shop / Product / Order
│   │   └── seed.js
│   └── src/
│       ├── middleware/       # JWT 认证
│       └── routes/           # auth / admin / merchant / user / public
├── docker-compose.yml
└── README.md
```

---

## 📄 许可证

MIT
