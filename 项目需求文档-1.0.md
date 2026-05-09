# ShopSimulator 项目需求文档

## 一、项目定位

**一句话描述**：一个自娱自乐的模拟购物平台，用户可扮演管理员、商户、买家三种角色，自由创建商品并完成交易。

**核心场景**：
- 管理员创建“法拉利旗舰店”“劳力士专营店”等商户
- 给这些商户上传豪车、名表等虚拟商品
- 注册买家账号，用管理员给的钱买下这些商品
- 纯粹体验“买买买”的快感，无真实货币交易

**目标用户**：自娱自乐的个人用户

---

## 二、角色与功能

| 角色 | 功能描述 |
|------|----------|
| **管理员（Admin）** | 管理所有商户账号（增删改查）、管理所有用户账号（增删改查）、查看/删除所有购买记录、给任意商户或用户账户**打钱** |
| **商户（Merchant）** | 注册登录、管理自己的商品（上架/下架/编辑/删除）、查看自己的销售记录、查看账户余额 |
| **用户（User）** | 注册登录、浏览所有商户和商品、购买商品（扣除余额）、查看自己的购买记录、查看账户余额 |

---

## 三、技术栈

| 层级 | 技术选型 |
|------|----------|
| **前端** | React + React Router + Axios + Ant Design（或 Tailwind CSS） |
| **后端** | Node.js + Express（或 Spring Boot，根据 Trae 推荐选择） |
| **数据库** | MySQL |
| **状态管理** | React Context 或 Zustand |
| **认证方案** | JWT Token |

---

## 四、数据库设计

### 4.1 users 表（统一存储所有账号）

```sql
CREATE TABLE users (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password      VARCHAR(255) NOT NULL,       -- 加密存储
    role          ENUM('admin', 'merchant', 'user') NOT NULL,
    balance       DECIMAL(12, 2) DEFAULT 0.00,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 shops 表（商户店铺）

```sql
CREATE TABLE shops (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    merchant_id   INT NOT NULL,
    shop_name     VARCHAR(100) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (merchant_id) REFERENCES users(id)
);
```

### 4.3 products 表（商品）

```sql
CREATE TABLE products (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    shop_id       INT NOT NULL,
    product_name  VARCHAR(100) NOT NULL,
    description   TEXT,
    price         DECIMAL(12, 2) NOT NULL,
    image_url     VARCHAR(255),
    status        ENUM('active', 'inactive') DEFAULT 'active',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);
```

### 4.4 orders 表（购买记录）

```sql
CREATE TABLE orders (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    user_id       INT NOT NULL,
    product_id    INT NOT NULL,
    shop_id       INT NOT NULL,
    quantity      INT DEFAULT 1,
    total_price   DECIMAL(12, 2) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);
```

---

## 五、后端 API 设计

### 5.1 认证模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册账号 |
| POST | `/api/auth/login` | 登录，返回 JWT Token |

### 5.2 管理员模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 获取所有用户/商户列表 |
| PUT | `/api/admin/users/:id` | 修改账号信息 |
| DELETE | `/api/admin/users/:id` | 删除账号 |
| POST | `/api/admin/top-up` | 给用户/商户打钱 `{userId, amount}` |
| GET | `/api/admin/orders` | 查看所有购买记录 |
| DELETE | `/api/admin/orders/:id` | 删除指定订单 |

### 5.3 商户模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/merchant/products` | 获取自己的商品列表 |
| POST | `/api/merchant/products` | 上架新商品 |
| PUT | `/api/merchant/products/:id` | 编辑商品信息 |
| DELETE | `/api/merchant/products/:id` | 下架/删除商品 |
| GET | `/api/merchant/orders` | 查看自己店铺的销售记录 |

### 5.4 用户模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 浏览所有上架商品（可按店铺筛选） |
| GET | `/api/shops` | 浏览所有商户店铺 |
| POST | `/api/orders` | 购买商品 `{productId, quantity}` |
| GET | `/api/user/orders` | 查看自己的购买记录 |
| GET | `/api/user/balance` | 查看账户余额 |

---

## 六、前端页面结构

| 路径 | 页面名称 | 功能说明 |
|------|----------|----------|
| `/` | 首页 | 展示所有商户店铺列表，支持搜索 |
| `/login` | 登录页 | 统一登录入口，登录后按角色跳转 |
| `/register` | 注册页 | 选择角色（商户/用户）注册 |
| `/shop/:id` | 店铺详情页 | 展示该商户的所有商品，用户可购买 |
| `/admin` | 管理员后台 | 用户管理、商户管理、订单管理、打钱操作 |
| `/merchant` | 商户后台 | 商品管理（上架/下架/编辑）、销售记录、余额查看 |
| `/user/orders` | 我的订单 | 查看个人购买记录 |
| `/user/balance` | 我的余额 | 查看当前账户余额 |

---

## 七、非功能需求

- **安全性**：密码使用 bcrypt 加密存储，API 使用 JWT 鉴权，按角色做权限控制
- **可用性**：界面简洁直观，操作反馈及时（Loading 状态、错误提示）
- **数据校验**：前后端均做输入校验（用户名长度、价格非负、余额不可为负等）
