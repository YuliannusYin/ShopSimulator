---
alwaysApply: false
description: 
---
# SSDG-update — ShopSimulator 开发指南自动更新规则

> **激活方式**：当用户在对话中 `@SSDG-update` 时，按以下流程自动重新扫描项目并更新 `SSDev-guide` 规则文件。
>
> **触发时机**：开发一段时间后，用户通过 `@SSDG-update` 调用本规则。

---

## 执行流程

### 第一步：全面扫描

并行读取以下所有关键文件，获取项目最新状态：

**1. 数据库模型**
```
shopsimulator/server/prisma/schema.prisma
```

**2. API 路由文件**（全部 5 个）
```
shopsimulator/server/src/routes/auth.js
shopsimulator/server/src/routes/admin.js
shopsimulator/server/src/routes/merchant.js
shopsimulator/server/src/routes/user.js
shopsimulator/server/src/routes/public.js
```

**3. 服务端入口**（检查路由挂载是否有变化）
```
shopsimulator/server/src/index.js
```

**4. 前端路由定义**
```
shopsimulator/client/src/App.jsx
```

**5. 前端 API 封装**
```
shopsimulator/client/src/api/index.js
```

**6. 页面目录结构**
```
shopsimulator/client/src/pages/   — 递归列出所有子目录和文件
```

**7. 组件目录结构**
```
shopsimulator/client/src/components/   — 递归列出所有子目录和文件
```

**8. 状态管理**
```
shopsimulator/client/src/stores/   — 列出所有文件，并读取每个 store 文件内容
```

**9. Tailwind / 样式配置**（检查设计系统是否有变更）
```
shopsimulator/client/tailwind.config.js
shopsimulator/client/src/styles/globals.css
```

---

### 第二步：对比差异

将扫描结果与 SSDev-guide（`.trae/rules/SSDev-guide.md`）中的信息逐一对比：

| 对比维度 | 参考章节 | 检查要点 |
|----------|---------|---------|
| 数据库模型 | 第 6 节 | 模型增减、字段增减、类型变更、关系变更 |
| API 路由 | 第 4 节 | 新增路由（方法+路径+角色）、路径变更、删除路由、请求体变更 |
| 服务端挂载 | 第 4 节 | 是否有新的路由文件被挂载 |
| 前端路由 | 第 5 节 | 新增页面路由、路径变更、角色限制变更、页面删除 |
| 目录结构 | 第 3 节 | 新增/删除/重命名的文件或目录 |
| 页面组件 | 第 5 节 | 是否有 pages/ 下新增的子目录或文件未被路由表覆盖 |
| UI 组件库 | 第 9 节 | 是否有新增组件、已有组件 props 是否变更 |
| 状态管理 | 第 8 节 | store 增减、状态字段增减、方法增减 |
| API 封装 | 第 7 节 | baseURL、timeout、拦截器逻辑、localStorage key 有无变化 |
| 技术栈 | 第 2 节 | package.json 中依赖版本有无显著变化 |

**差异判定规则**：
- 新增项 → 需追加到对应章节
- 修改项 → 需更新对应章节的描述
- 删除项 → 需从对应章节移除
- 无变化 → 跳过该章节

---

### 第三步：更新 SSDev-guide

基于差异，使用 `SearchReplace` 工具精确更新 `.trae/rules/SSDev-guide.md` 中的对应部分：

1. **第 2 节 技术栈**：如果 package.json 版本有变化，更新版本号
2. **第 3 节 目录结构**：如果有文件/目录的新增或删除，更新目录树
3. **第 4 节 API 路由表**：新增/修改/删除路由，按原有表格格式追加或修改行
4. **第 5 节 前端路由表**：新增/修改/删除页面路由，更新表格
5. **第 6 节 数据库模型**：字段变更时更新对应模型的字段表
6. **第 7 节 API 封装**：如果拦截器或配置有变，更新描述
7. **第 8 节 状态管理**：store 变更时更新状态结构描述
8. **第 9 节 UI 组件库**：新增组件时追加组件文档
9. **第 10 节 设计规范**：色彩/字体/动效有变时更新
10. **第 11 节 开发约定**：如有新增约定，追加
11. **页脚更新**：将"最后更新时间"改为当天日期

**更新要求**：
- 严格保持 SSDev-guide 原有的 Markdown 格式和表格结构
- 仅更新有变化的部分，不要重写整个文件
- 每一处更新使用独立的 `SearchReplace` 操作

---

### 第四步：输出变更报告

更新完成后，用简洁的列表输出变更报告，格式如下：

```
## SSDev-guide 更新报告

### 扫描范围
- 扫描文件：schema.prisma、5 个路由文件、App.jsx、api/index.js、3 个 store 文件、8 个页面文件、6 个 UI 组件、tailwind.config.js、globals.css
- 扫描目录：pages/、components/、stores/

### 发现的变更
- ✅ API 路由：新增 X 个 / 修改 X 个 / 删除 X 个
- ✅ 前端路由：新增 X 个 / 修改 X 个 / 删除 X 个
- ✅ 数据库模型：X 个字段变更
- ✅ 组件：新增 X 个 / 修改 X 个
- ✅ 状态管理：X 个变更
- ⬜ API 封装：无变化
- ⬜ 设计系统：无变化

### 更新的章节
- 第 3 节：目录结构（新增 X 个文件）
- 第 4 节：API 路由表（新增/修改 X 条路由）
- ...
```

---

## 重要原则

1. **只更新已确认存在的文件和代码**，不猜测、不推断未在扫描中发现的变更
2. **如果某文件无法访问**（路径错误、文件被删除），在报告中明确说明："⚠️ 无法访问：`path/to/file`"
3. **保持 SSDev-guide 原有格式和结构不变**，不做无谓的重排或风格变更
4. **并行读取文件**以提升效率，所有第一步的扫描文件一次性并行读取
5. **不要跳过任何对比维度**，即使预判无变化也应扫描确认
6. **如果无任何变更**，报告应明确输出："✅ 未发现任何变更，SSDev-guide 无需更新"

---

> **本文档更新时间**：2026-05-08
