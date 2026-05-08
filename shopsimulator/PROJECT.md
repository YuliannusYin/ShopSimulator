# ShopSimulator · 项目结构

---

## 一、项目结构

```
shopsimulator/
├── docker-compose.yml                   # MySQL 8.0 容器
├── .gitignore
├── README.md
│
├── client/                              # 前端 (React + Vite)
│   ├── index.html                       # HTML 入口
│   ├── vite.config.js                   # Vite 配置 (proxy /api → :3001)
│   ├── tailwind.config.js               # Tailwind (darkMode: class, 自定义色值)
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                     # React 入口 (BrowserRouter + 主题初始化)
│       ├── App.jsx                      # 路由定义 (ProtectedRoute 包装)
│       ├── api/
│       │   └── index.js                 # Axios 实例 (baseURL /api, JWT 拦截器)
│       ├── stores/
│       │   ├── authStore.js             # token + user, localStorage 持久化
│       │   ├── productStore.js          # products / loading / error
│       │   └── orderStore.js            # orders / loading / error
│       ├── styles/
│       │   └── globals.css              # CSS Variables (暗色 + 亮色), 全局重置
│       ├── components/
│       │   ├── ui/                      # 原子 UI 组件
│       │   │   ├── Button.jsx           # variant: primary|secondary|danger|ghost
│       │   │   ├── Input.jsx            # label, error, focus:border-accent
│       │   │   ├── Card.jsx             # hover 属性 → border-accent
│       │   │   ├── Badge.jsx            # variant: default|active|warning|error
│       │   │   ├── Modal.jsx            # Esc 关闭, 点击遮罩关闭
│       │   │   └── Skeleton.jsx         # 骨架屏 (含 SkeletonLine/Card/Table)
│       │   ├── layout/                  # 布局组件
│       │   │   ├── Layout.jsx           # Sidebar + TopBar + main
│       │   │   ├── Sidebar.jsx          # 可折叠, 按角色导航
│       │   │   └── TopBar.jsx           # 主题切换 + 余额 + logout
│       │   └── shared/
│       │       └── ProtectedRoute.jsx   # roles 白名单, token → /login
│       └── pages/
│           ├── Login.jsx                # 登录页 (无 Layout)
│           ├── Register.jsx             # 注册页 (无 Layout, 选角色)
│           ├── Home.jsx                 # 首页: 店铺网格 + 逛商场入口
│           ├── ShopDetail.jsx           # 店铺详情: 商品列表含缩略图
│           ├── ProductDetail.jsx        # 商品详情: 大图/购买弹窗
│           ├── Explore.jsx              # 逛商场: 随机网格/换一批/Toast
│           ├── admin/
│           │   └── Dashboard.jsx        # 管理员: Users/Orders Tab
│           ├── merchant/
│           │   └── Dashboard.jsx        # 商户: Products/Sales Tab
│           └── user/
│               ├── Orders.jsx           # 我的订单
│               └── Balance.jsx          # 我的余额
│
└── server/                              # 后端 (Node.js + Express)
    ├── package.json
    ├── .env                             # DATABASE_URL, JWT_SECRET, PORT
    ├── prisma/
    │   ├── schema.prisma                # User / Shop / Product / Order 四模型
    │   └── seed.js                      # 预置测试数据
    └── src/
        ├── index.js                     # Express 入口 (挂载 prisma 到 app.locals)
        ├── middleware/
        │   └── auth.js                  # authenticate, requireRole(...roles)
        └── routes/
            ├── auth.js                  # POST /register, POST /login
            ├── admin.js                 # Admin 路由 (全部需 admin 角色)
            ├── merchant.js              # Merchant 路由 (全部需 merchant 角色)
            ├── user.js                  # User 路由 (全部需 user 角色)
            └── public.js                # 公开路由 (shops, products, POST /orders)
```

---

## 二、数据库表结构

### users

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT (PK, AUTO_INCREMENT) | 主键 |
| `username` | VARCHAR(50), UNIQUE | 用户名 |
| `password` | VARCHAR(255) | bcrypt 哈希密码 |
| `role` | VARCHAR(20) | `admin` / `merchant` / `user` |
| `balance` | DECIMAL(12,2) | 余额，默认 0.00 |
| `created_at` | DATETIME | 创建时间，默认 NOW() |

### shops

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT (PK, AUTO_INCREMENT) | 主键 |
| `merchant_id` | INT (FK → users.id) | 商户用户 ID |
| `shop_name` | VARCHAR(100) | 店铺名称 |
| `description` | TEXT, NULLABLE | 店铺简介 |
| `created_at` | DATETIME | 创建时间，默认 NOW() |

### products

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT (PK, AUTO_INCREMENT) | 主键 |
| `shop_id` | INT (FK → shops.id) | 所属店铺 ID |
| `product_name` | VARCHAR(100) | 商品名称 |
| `description` | TEXT, NULLABLE | 商品描述 |
| `price` | DECIMAL(12,2) | 单价 |
| `image_url` | VARCHAR(255), NULLABLE | 封面图片 URL |
| `status` | VARCHAR(20) | `active` / `inactive`，默认 active |
| `created_at` | DATETIME | 创建时间，默认 NOW() |

### orders

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | INT (PK, AUTO_INCREMENT) | 主键 |
| `user_id` | INT (FK → users.id) | 购买用户 ID |
| `product_id` | INT (FK → products.id) | 购买商品 ID |
| `shop_id` | INT (FK → shops.id) | 所属店铺 ID |
| `quantity` | INT | 购买数量，默认 1 |
| `total_price` | DECIMAL(12,2) | 总价 (price × quantity) |
| `created_at` | DATETIME | 创建时间，默认 NOW() |

### 关系

```
User (1) ──< Shop     (merchant_id)
User (1) ──< Order    (user_id)
Shop (1) ──< Product  (shop_id)
Shop (1) ──< Order    (shop_id)
Product(1) ──< Order  (product_id)
```

---

## 三、全部页面路由

| 路径 | 页面 | 功能说明 | 所需角色 |
|------|------|----------|----------|
| `/login` | Login | 登录表单，居中布局 | 无需登录 |
| `/register` | Register | 注册表单，选择 merchant/user 角色 | 无需登录 |
| `/` | Home | 店铺搜索网格 + 逛商场入口卡片 | user, admin |
| `/shop/:id` | ShopDetail | 店铺详情 + 商品列表(含缩略图) + 快速购买 | user, admin |
| `/product/:id` | ProductDetail | 商品大图/名称/价格/描述/购买弹窗 | user, admin |
| `/explore` | Explore | 随机商品网格 / 换一批 / + 快速购买 / Toast | user, admin |
| `/admin` | AdminDashboard | 用户管理（CRUD/打钱）+ 全站订单管理 | admin |
| `/merchant` | MerchantDashboard | 店铺管理 + 商品 CRUD(含封面图) + 销售记录 | merchant |
| `/user/orders` | UserOrders | 我的购买记录 | user |
| `/user/balance` | UserBalance | 我的余额展示 | user |

---

## 四、全部后端 API

### Auth

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|----------|
| POST | `/api/auth/register` | 注册 `{username, password, role}` → token + user | 无 |
| POST | `/api/auth/login` | 登录 `{username, password}` → token + user | 无 |

### Public

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|----------|
| GET | `/api/shops` | 店铺列表 (含 _count.products) | 无 |
| GET | `/api/shops/:id` | 店铺详情 | 无 |
| GET | `/api/products?shopId=` | 某店铺商品列表 | 无 |
| GET | `/api/products/:id` | 商品详情 (含 shop 关联) | 无 |
| POST | `/api/orders` | 购买 `{productId, quantity}` → 事务扣款 | login |

### Admin

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|----------|
| GET | `/api/admin/users?search=&role=` | 用户列表 | admin |
| PUT | `/api/admin/users/:id` | 编辑用户 | admin |
| DELETE | `/api/admin/users/:id` | 删除用户 | admin |
| POST | `/api/admin/top-up` | 打钱 `{userId, amount}` | admin |
| GET | `/api/admin/orders` | 全部订单 | admin |
| DELETE | `/api/admin/orders/:id` | 删除订单 | admin |

### Merchant

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|----------|
| GET | `/api/merchant/shop` | 我的店铺 | merchant |
| POST | `/api/merchant/shop` | 创建店铺 `{shopName, description?}` | merchant |
| PUT | `/api/merchant/shop` | 更新店铺 `{shopName?, description?}` | merchant |
| GET | `/api/merchant/products` | 我的商品列表 | merchant |
| POST | `/api/merchant/products` | 上架商品 `{productName, description?, price, imageUrl?}` | merchant |
| PUT | `/api/merchant/products/:id` | 编辑商品 `{productName?, price?, imageUrl?, status?}` | merchant |
| DELETE | `/api/merchant/products/:id` | 下架商品 | merchant |
| GET | `/api/merchant/orders` | 销售记录 | merchant |

### User

| 方法 | 路径 | 说明 | 所需角色 |
|------|------|------|----------|
| GET | `/api/user/orders` | 我的订单 | user |
| GET | `/api/user/balance` | 我的余额 | user |

---

## 五、角色权限矩阵

### 页面访问

| 功能 | Admin | Merchant | User |
|------|:-----:|:--------:|:----:|
| 登录 / 注册 | ✅ | ✅ | ✅ |
| 首页 (店铺列表) | ✅ | ❌ | ✅ |
| 店铺详情 (/shop/:id) | ✅ | ❌ | ✅ |
| 商品详情 (/product/:id) | ✅ | ❌ | ✅ |
| 逛商场 (/explore) | ✅ | ❌ | ✅ |
| 管理员后台 (/admin) | ✅ | ❌ | ❌ |
| 商户后台 (/merchant) | ❌ | ✅ | ❌ |
| 我的订单 (/user/orders) | ❌ | ❌ | ✅ |
| 我的余额 (/user/balance) | ❌ | ❌ | ✅ |

### 数据操作

| 功能 | Admin | Merchant | User |
|------|:-----:|:--------:|:----:|
| 查看所有用户 | ✅ | ❌ | ❌ |
| 编辑/删除用户 | ✅ | ❌ | ❌ |
| 给用户打钱 | ✅ | ❌ | ❌ |
| 查看/删除全站订单 | ✅ | ❌ | ❌ |
| 创建/编辑店铺 | ❌ | ✅ | ❌ |
| 上架商品 | ❌ | ✅ | ❌ |
| 编辑/下架商品 | ❌ | ✅ | ❌ |
| 查看销售记录 | ❌ | ✅ | ❌ |
| 浏览商品 | ✅ | ❌ | ✅ |
| 购买商品 | ❌ | ❌ | ✅ |
| 查看自己的订单 | ❌ | ❌ | ✅ |
| 查看自己的余额 | ❌ | ❌ | ✅ |
