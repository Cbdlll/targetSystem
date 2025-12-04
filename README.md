# Web安全漏洞测试靶场

欢迎来到Web安全漏洞测试靶场！这是一个功能完整的、基于容器的全栈Web应用，旨在帮助安全爱好者和开发者学习、识别和利用不同类型的Web安全漏洞。

该项目模拟了一个真实的新闻门户网站，包含文章浏览、搜索、留言板和用户资料等功能，并精心植入了**40个XSS漏洞**和**10+个SQL注入漏洞**。

## 技术栈

- **后端:** Node.js, Express.js, SQLite
- **前端:** React (Vite), React Router
- **部署:** Docker, Docker Compose

## 系统功能

### 核心模块
- 📰 **新闻系统**: 新闻发布、浏览、详情查看
- 💬 **评论系统**: 新闻评论、留言板
- 👤 **用户管理**: 用户列表、个人资料编辑
- 🔍 **搜索功能**: 关键词搜索、高级搜索
- 📧 **反馈系统**: 用户反馈提交与展示
- 🏷️ **标签系统**: 标签管理、颜色配置
- � **订阅系统**: 类别订阅、通知管理
- ⭐ **收藏系统**: 新闻收藏、备注管理
- 📤 **分享系统**: 社交分享、自定义消息
- 📡 **RSS订阅**: RSS源管理、阅读器
- 🤖 **推荐系统**: 个性化推荐、推荐理由
- 📝 **编辑后台**: 新闻审核、发布管理
- 📈 **统计分析**: 网站数据统计、流量报表

### API端点

#### 新闻系统
- `/api/news` - 新闻列表和创建
- `/api/news/:id` - 新闻详情
- `/api/news/category/:category` - 按分类查询
- `/api/comments` - 留言板

#### 用户系统
- `/api/users` - 用户列表
- `/api/users/:id` - 用户详情
- `/api/users/search` - 用户搜索
- `/api/auth/login` - 用户登录
- `/api/auth/register` - 用户注册
- `/api/auth/check-username/:username` - 检查用户名

#### 产品商城
- `/api/products` - 产品列表
- `/api/products/:id` - 产品详情
- `/api/products/search` - 产品搜索
- `/api/products/:id/stock` - 更新库存

#### 订单管理
- `/api/orders` - 订单列表
- `/api/orders/user/:userId` - 用户订单
- `/api/orders/:id` - 删除订单

#### 其他功能
- `/api/feedback` - 用户反馈
- `/api/categories` - 新闻分类
- `/api/search/advanced` - 高级搜索
- `/api/stats` - 统计信息
- `/api/tags` - 标签管理
- `/api/subscriptions` - 订阅管理
- `/api/favorites` - 收藏夹
- `/api/shares` - 分享记录
- `/api/rss` - RSS源
- `/api/recommendations` - 推荐内容
- `/api/editor/*` - 编辑后台
- `/api/analytics` - 数据分析

## 快速启动

整个应用已完全容器化，你只需要安装 Docker 和 Docker Compose 即可一键启动。

1.  **构建并运行容器:**
    在项目根目录（`docker-compose.yml` 所在位置）打开终端，运行以下命令：
    ```bash
    docker-compose up --build
    ```

2.  **访问应用:**
    - **前端:** `http://localhost:3000`
    - **后端 API:** `http://localhost:3001`

应用启动后，请在浏览器中访问 `http://localhost:3000` 开始探索。

---

## 漏洞开关配置

本项目内置全局漏洞开关，可在**测试模式**（存在漏洞）和**安全模式**（无漏洞）之间切换。

### 配置步骤

1. **编辑配置文件** `docker-compose.yml`
2. **修改环境变量** `VULNERABILITIES_ENABLED`
3. **重新构建启动** 容器

### 测试模式（默认）

```yaml
environment:
  - VULNERABILITIES_ENABLED=true  # 启用XSS漏洞
```

- ✅ 所有XSS漏洞激活
- ✅ 用户输入不做过滤
- ✅ 适合安全研究和学习
- ⚠️ 请勿在生产环境使用

### 安全模式

```yaml
environment:
  - VULNERABILITIES_ENABLED=false  # 禁用XSS漏洞
```

- 🛡️ 所有输入进行HTML转义
- 🛡️ 防止XSS攻击
- ✅ 可参考安全实现

### 快速切换

```bash
# 1. 停止容器
docker compose down

# 2. 修改 docker-compose.yml 中的 VULNERABILITIES_ENABLED

# 3. 重新构建并启动
docker compose up --build -d
```

📖 **详细配置说明**: 参见 [CONFIGURATION.md](./CONFIGURATION.md)

### 重要提示

⚠️ **本系统不使用数据持久化**，容器重启后数据会清空，适合测试环境使用。

---

## 漏洞挑战清单

欢迎来到XSS挑战！此应用中精心植入了**40个**不同类型和难度的XSS漏洞，覆盖了存储型、反射型和DOM型XSS的各种场景。

**📖 完整漏洞文档**: 请查看 [XSS_VULNERABILITIES.md](./XSS_VULNERABILITIES.md) 获取所有40个漏洞的详细描述、利用方法和代码位置。

以下是快速参考清单：

### 快速漏洞索引

#### 后端 API漏洞

| V-ID | 难度 | 类型 | 触发位置 |
| :--- | :--- | :--- | :--- |
| V1 | ⭐ | 反射型 - JSON | `/api/echo?data=<payload>` |
| V19 | ⭐⭐⭐ | 反射型 - Header注入 | `/api/redirect?msg=<payload>` |
| V20 | ⭐⭐⭐ | 反射型 - JSONP | `/api/jsonp?callback=<payload>` |
| V23 | ⭐ | 存储型 - 通知 | `/api/notifications` (message) |
| V38 | ⭐⭐ | 反射型 - 分析参数 | `/api/analytics` (params) |

#### 留言板漏洞 (`/guestbook`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V2 | ⭐ | 存储型 - HTML | 用户名字段 → H5标题 |
| V3 | ⭐ | 存储型 - HTML | 留言内容 → 段落 |
| V4 | ⭐⭐ | 存储型 - 属性 | 用户名 → `data-username`属性 |
| V5 | ⭐⭐ | 存储型 - JS上下文 | 用户名 → `alert()`参数 |

#### 搜索功能漏洞 (`/search`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V6 | ⭐ | 反射型 - HTML | 搜索词 → `<strong>` |
| V7 | ⭐⭐ | 反射型 - 属性 | 搜索词 → `input.value` |
| V8 | ⭐⭐⭐ | 反射型 - eval | 搜索词 → `eval()` |
| V24 | ⭐⭐ | 反射型 | 高级搜索多参数反射 |

#### 个人资料页漏洞 (`/profile`, `/users`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V9 | ⭐⭐ | DOM型 | `?username=` → `innerHTML` |
| V10 | ⭐⭐ | DOM型 | `#redirectUrl=` → `location.href` |
| V11 | ⭐⭐⭐ | DOM型 | `?note=` → `document.write()` |
| V16 | ⭐⭐⭐ | DOM型 | `?delay=` → `setTimeout()` |
| V17 | ⭐⭐⭐ | DOM型 | `?script=` → 动态script标签 |
| V21 | ⭐⭐ | 存储型 | 用户Bio字段 |

#### 新闻系统漏洞 (`/`, `/news/:id`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V12 | ⭐ | 存储型 | 新闻标题 → HTML渲染 |
| V13 | ⭐⭐ | DOM型 | `?title=` → `innerHTML` |
| V14 | ⭐⭐⭐ | DOM型 | `#filter=` → `eval()` |
| V15 | ⭐⭐ | 存储型 | 作者名 → `data-author`属性 |
| V22 | ⭐ | 存储型 | 评论作者/内容 |
| V25 | ⭐ | 存储型 | 新闻正文 |

#### 反馈系统漏洞 (`/feedback`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V18 | ⭐⭐ | 存储型 | Email字段 → HTML渲染 |

#### 标签与订阅 (`/tags`, `/subscriptions`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V26 | ⭐⭐ | DOM型 | `?tag=` → `innerHTML` |
| V27 | ⭐ | 存储型 | 标签名称 |
| V28 | ⭐⭐⭐ | DOM型 | `#category=` → `eval()` |
| V29 | ⭐⭐ | 存储型 | 订阅备注 |

#### 收藏与分享 (`/favorites`, `/share`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V30 | ⭐⭐ | DOM型 | `?user=` → `innerHTML` |
| V31 | ⭐⭐ | 存储型 | 收藏备注 |
| V32 | ⭐⭐⭐ | DOM型 | `?platform=` → 动态script |
| V33 | ⭐⭐ | 存储型 | 分享消息 |

#### RSS与推荐 (`/rss`, `/recommendations`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V34 | ⭐⭐⭐ | DOM型 | `?feed=` → `setTimeout()` |
| V35 | ⭐⭐ | 存储型 | RSS描述 |
| V39 | ⭐⭐ | DOM型 | `?reason=` → `location.href` |
| V40 | ⭐⭐ | 存储型 | 推荐理由 |

#### 编辑后台 (`/editor`)

| V-ID | 难度 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| V36 | ⭐⭐⭐ | DOM型 | `?review=` → `document.write()` |
| V37 | ⭐⭐ | 存储型 | 审核意见 |

### 发布恶意新闻进行测试

使用 `curl` 向后端API发送POST请求创建包含XSS的新闻：

```bash
curl -X POST http://localhost:3001/api/news \
  -H "Content-Type: application/json" \
  -d '{"title":"<script>alert(\"XSS\")</script>测试","content":"内容","author":"作者"}'
```

---

## SQL注入漏洞

本系统除了XSS漏洞外，还在多个业务功能中隐藏了SQL注入漏洞，这些漏洞存在于：

- 新闻查询和筛选
- 用户认证和注册
- 产品搜索和管理
- 订单查询和处理
- 用户搜索功能

**📖 详细分析报告**: 请查看 [SQL_INJECTIONS.md](./SQL_INJECTIONS.md) 获取完整的漏洞分析、测试方法和修复建议。

### 数据库结构

系统使用SQLite数据库，包含以下数据表：

- **news** - 新闻文章（id, title, content, author, publish_date, category, views, status）
- **users_db** - 用户账户（id, username, password, email, role, created_at）
- **products** - 产品信息（id, name, description, price, stock, category）
- **orders** - 订单记录（id, user_id, product_id, quantity, total_price, status, order_date）
- **logs** - 系统日志（id, user_id, action, ip_address, user_agent, created_at）

### 测试账户

- 管理员: `admin` / `admin123`
- 编辑: `editor` / `editor456`
- 普通用户: `user1` / `pass123`

---

**免责声明:** 本项目仅用于教育和研究目的，旨在帮助开发者理解并防范安全漏洞。请勿在任何未经授权的系统上使用这些攻击技术。