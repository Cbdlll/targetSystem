const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 3001;

// --- 安全配置 ---
// 从环境变量读取漏洞开关状态
const VULNERABILITIES_ENABLED = process.env.VULNERABILITIES_ENABLED === 'true';

// 用于“安全模式”的HTML转义函数
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// --- 中间件 ---
app.use(cors());
app.use(express.json());

// --- 模拟数据库 (用于留言板和其他功能) ---
let comments = [];
let nextCommentId = 1;

// 用户数据（模拟）
let users = [
  { id: 1, username: 'admin', email: 'admin@news.com', role: 'admin', bio: '网站管理员' },
  { id: 2, username: 'editor', email: 'editor@news.com', role: 'editor', bio: '资深编辑' },
  { id: 3, username: 'user123', email: 'user@example.com', role: 'user', bio: '普通用户' }
];
let nextUserId = 4;

// 新闻分类
const categories = ['科技', '健康', '旅游', '财经', '娱乐', '体育', '教育'];

// 新闻评论
let newsComments = [];
let nextNewsCommentId = 1;

// 用户通知
let notifications = [];
let nextNotificationId = 1;

// 标签系统
let tags = [];
let nextTagId = 1;

// 订阅系统
let subscriptions = [];
let nextSubscriptionId = 1;

// 收藏系统
let favorites = [];
let nextFavoriteId = 1;

// 分享记录
let shares = [];
let nextShareId = 1;

// RSS订阅源
let rssFeeds = [];
let nextRssFeedId = 1;

// 推荐内容
let recommendations = [];
let nextRecommendationId = 1;

// --- API Endpoints ---

// 获取所有新闻列表
app.get('/api/news', (req, res) => {
  const sql = "SELECT id, title, author, publish_date FROM news ORDER BY publish_date DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// 获取单篇新闻 (SQL注入漏洞-1: 整数型注入)
app.get('/api/news/:id', (req, res) => {
  const id = req.params.id;
  // 漏洞：直接拼接ID参数，没有验证和参数化
  const sql = `SELECT * FROM news WHERE id = ${id}`;
  
  db.get(sql, [], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    if (row) {
      res.json({
        "message": "success",
        "data": row
      });
    } else {
      res.status(404).json({ "error": "News not found" });
    }
  });
});

// (新增) 发布一篇新文章 (存储型XSS漏洞点)
app.post('/api/news', (req, res) => {
  let { title, content, author } = req.body;
  const publish_date = new Date().toISOString().split('T')[0];

  if (!title || !content || !author) {
    return res.status(400).json({ error: '标题、内容和作者均不能为空' });
  }

  // 如果漏洞开关关闭，则对输入进行清理
  if (!VULNERABILITIES_ENABLED) {
    title = escapeHtml(title);
    content = escapeHtml(content);
    author = escapeHtml(author);
  }

  const insert = 'INSERT INTO news (title, content, author, publish_date) VALUES (?,?,?,?)';
  db.run(insert, [title, content, author, publish_date], function(err) {
    if (err) {
      return res.status(400).json({ "error": err.message });
    }
    res.status(201).json({
      "message": "success",
      "data": { id: this.lastID, title, content, author, publish_date },
    });
  });
});

// (新增) 反射型API漏洞点
app.get('/api/echo', (req, res) => {
  const { data } = req.query;
  // 在漏洞模式下，直接反射输入
  const responseData = VULNERABILITIES_ENABLED ? data : escapeHtml(data);
  res.json({
    "userInput": responseData
  });
});


// --- 留言板 API ---

// 获取所有留言
app.get('/api/comments', (req, res) => {
  res.json(comments);
});

// 新增一条留言 (存储型XSS漏洞点)
app.post('/api/comments', (req, res) => {
  let { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ error: '用户名和内容不能为空' });
  }

  // 如果漏洞开关关闭，则对输入进行清理
  if (!VULNERABILITIES_ENABLED) {
    username = escapeHtml(username);
    content = escapeHtml(content);
  }
  
  // 在漏洞开启模式下，原始输入被直接存储
  const newComment = {
    id: nextCommentId++,
    username,
    content,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// --- 用户反馈 API ---
let feedbacks = [];
let nextFeedbackId = 1;

// 获取所有反馈 (V18: 存储型XSS - 反馈邮箱字段)
app.get('/api/feedback', (req, res) => {
  res.json(feedbacks);
});

// 提交反馈 (V18: 存储型XSS漏洞点 - email字段不做转义)
app.post('/api/feedback', (req, res) => {
  let { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: '姓名、邮箱和消息均不能为空' });
  }

  // 在漏洞开启模式下，email字段不做清理（易被忽略的漏洞点）
  if (!VULNERABILITIES_ENABLED) {
    name = escapeHtml(name);
    email = escapeHtml(email);
    message = escapeHtml(message);
  }

  const newFeedback = {
    id: nextFeedbackId++,
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  feedbacks.push(newFeedback);
  res.status(201).json(newFeedback);
});

// V19: 反射型XSS - HTTP响应头注入
app.get('/api/redirect', (req, res) => {
  const { url, msg } = req.query;
  if (VULNERABILITIES_ENABLED && msg) {
    // 在响应头中设置自定义消息，可能导致header injection
    res.setHeader('X-Redirect-Message', msg);
  }
  if (url) {
    res.redirect(url);
  } else {
    res.json({ message: '请提供url参数' });
  }
});

// V20: 反射型XSS - JSONP回调函数
app.get('/api/jsonp', (req, res) => {
  const { callback, data } = req.query;
  const responseData = { message: 'success', data: data || 'test' };
  
  if (VULNERABILITIES_ENABLED && callback) {
    // JSONP漏洞：callback参数未验证，直接拼接
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`${callback}(${JSON.stringify(responseData)})`);
  } else {
    res.json(responseData);
  }
});


// --- 用户管理 API ---

// 获取所有用户列表
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 获取单个用户信息 (V21: 存储型XSS - 用户bio字段)
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: '用户不存在' });
  }
});

// 更新用户信息 (V21漏洞点 - bio字段不过滤)
app.put('/api/users/:id', (req, res) => {
  let { username, email, bio } = req.body;
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  // 漏洞：bio字段不做清理
  if (!VULNERABILITIES_ENABLED) {
    username = escapeHtml(username);
    email = escapeHtml(email);
    bio = escapeHtml(bio);
  }

  users[userIndex] = { ...users[userIndex], username, email, bio };
  res.json(users[userIndex]);
});

// --- 新闻分类 API ---

// 获取所有分类
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// 按分类获取新闻 (SQL注入漏洞-2: 字符串型注入)
app.get('/api/news/category/:category', (req, res) => {
  const category = req.params.category;
  // 漏洞：字符串参数直接拼接到SQL中
  const sql = `SELECT id, title, author, category, views, publish_date FROM news WHERE category = '${category}'`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ 
      message: "success", 
      category: category,
      data: rows 
    });
  });
});

// --- 新闻评论 API ---

// 获取某篇新闻的所有评论
app.get('/api/news/:id/comments', (req, res) => {
  const newsId = parseInt(req.params.id);
  const comments = newsComments.filter(c => c.newsId === newsId);
  res.json(comments);
});

// 为新闻添加评论 (V22: 存储型XSS - 评论内容)
app.post('/api/news/:id/comments', (req, res) => {
  let { author, content } = req.body;
  const newsId = parseInt(req.params.id);

  if (!author || !content) {
    return res.status(400).json({ error: '作者和内容不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    author = escapeHtml(author);
    content = escapeHtml(content);
  }

  const newComment = {
    id: nextNewsCommentId++,
    newsId,
    author,
    content,
    createdAt: new Date().toISOString()
  };

  newsComments.push(newComment);
  res.status(201).json(newComment);
});

// --- 用户通知 API ---

// 获取用户通知 (V23: 存储型XSS - 通知消息)
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// 创建通知
app.post('/api/notifications', (req, res) => {
  let { userId, message, type } = req.body;

  if (!VULNERABILITIES_ENABLED) {
    message = escapeHtml(message);
  }

  const notification = {
    id: nextNotificationId++,
    userId,
    message,
    type: type || 'info',
    read: false,
    createdAt: new Date().toISOString()
  };

  notifications.push(notification);
  res.status(201).json(notification);
});

// --- 搜索增强 API ---

// 高级搜索 (V24: 反射型XSS - 多参数搜索)
app.get('/api/search/advanced', (req, res) => {
  let { title, author, content, dateFrom, dateTo } = req.query;

  if (!VULNERABILITIES_ENABLED) {
    title = title ? escapeHtml(title) : '';
    author = author ? escapeHtml(author) : '';
    content = content ? escapeHtml(content) : '';
  }

  res.json({
    message: 'success',
    searchParams: { title, author, content, dateFrom, dateTo },
    results: []
  });
});

// --- 标签系统 API ---

// 获取所有标签
app.get('/api/tags', (req, res) => {
  res.json(tags);
});

// 创建标签 (新漏洞点 - 标签名称)
app.post('/api/tags', (req, res) => {
  let { name, description, color } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: '标签名称不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    name = escapeHtml(name);
    description = description ? escapeHtml(description) : '';
    color = color ? escapeHtml(color) : '#007bff';
  }

  const newTag = {
    id: nextTagId++,
    name,
    description: description || '',
    color: color || '#007bff',
    createdAt: new Date().toISOString()
  };

  tags.push(newTag);
  res.status(201).json(newTag);
});

// --- 订阅系统 API ---

// 获取用户订阅列表
app.get('/api/subscriptions', (req, res) => {
  const { userId, category } = req.query;
  let result = subscriptions;
  
  if (userId) {
    result = result.filter(s => s.userId === parseInt(userId));
  }
  if (category) {
    result = result.filter(s => s.category === category);
  }
  
  res.json(result);
});

// 创建订阅 (新漏洞点 - 订阅备注)
app.post('/api/subscriptions', (req, res) => {
  let { userId, category, note } = req.body;
  
  if (!userId || !category) {
    return res.status(400).json({ error: '用户ID和分类不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    category = escapeHtml(category);
    note = note ? escapeHtml(note) : '';
  }

  const newSubscription = {
    id: nextSubscriptionId++,
    userId: parseInt(userId),
    category,
    note: note || '',
    createdAt: new Date().toISOString()
  };

  subscriptions.push(newSubscription);
  res.status(201).json(newSubscription);
});

// --- 收藏系统 API ---

// 获取用户收藏
app.get('/api/favorites', (req, res) => {
  const { userId } = req.query;
  let result = favorites;
  
  if (userId) {
    result = result.filter(f => f.userId === parseInt(userId));
  }
  
  res.json(result);
});

// 添加收藏 (新漏洞点 - 收藏备注)
app.post('/api/favorites', (req, res) => {
  let { userId, newsId, note } = req.body;
  
  if (!userId || !newsId) {
    return res.status(400).json({ error: '用户ID和新闻ID不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    note = note ? escapeHtml(note) : '';
  }

  const newFavorite = {
    id: nextFavoriteId++,
    userId: parseInt(userId),
    newsId: parseInt(newsId),
    note: note || '',
    createdAt: new Date().toISOString()
  };

  favorites.push(newFavorite);
  res.status(201).json(newFavorite);
});

// --- 分享系统 API ---

// 获取分享记录
app.get('/api/shares', (req, res) => {
  const { platform } = req.query;
  let result = shares;
  
  if (platform) {
    result = result.filter(s => s.platform === platform);
  }
  
  res.json(result);
});

// 创建分享记录 (新漏洞点 - 分享平台和自定义消息)
app.post('/api/shares', (req, res) => {
  let { newsId, platform, customMessage } = req.body;
  
  if (!newsId || !platform) {
    return res.status(400).json({ error: '新闻ID和分享平台不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    platform = escapeHtml(platform);
    customMessage = customMessage ? escapeHtml(customMessage) : '';
  }

  const newShare = {
    id: nextShareId++,
    newsId: parseInt(newsId),
    platform,
    customMessage: customMessage || '',
    createdAt: new Date().toISOString()
  };

  shares.push(newShare);
  res.status(201).json(newShare);
});

// --- RSS订阅 API ---

// 获取RSS订阅源列表
app.get('/api/rss', (req, res) => {
  res.json(rssFeeds);
});

// 添加RSS订阅源 (新漏洞点 - RSS源名称和描述)
app.post('/api/rss', (req, res) => {
  let { name, url, description } = req.body;
  
  if (!name || !url) {
    return res.status(400).json({ error: '名称和URL不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    name = escapeHtml(name);
    url = escapeHtml(url);
    description = description ? escapeHtml(description) : '';
  }

  const newRssFeed = {
    id: nextRssFeedId++,
    name,
    url,
    description: description || '',
    createdAt: new Date().toISOString()
  };

  rssFeeds.push(newRssFeed);
  res.status(201).json(newRssFeed);
});

// --- 推荐系统 API ---

// 获取推荐内容
app.get('/api/recommendations', (req, res) => {
  const { userId, type } = req.query;
  let result = recommendations;
  
  if (userId) {
    result = result.filter(r => r.userId === parseInt(userId));
  }
  if (type) {
    result = result.filter(r => r.type === type);
  }
  
  res.json(result);
});

// 创建推荐 (新漏洞点 - 推荐理由)
app.post('/api/recommendations', (req, res) => {
  let { userId, newsId, reason } = req.body;
  
  if (!userId || !newsId) {
    return res.status(400).json({ error: '用户ID和新闻ID不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    reason = reason ? escapeHtml(reason) : '';
  }

  const newRecommendation = {
    id: nextRecommendationId++,
    userId: parseInt(userId),
    newsId: parseInt(newsId),
    reason: reason || '',
    createdAt: new Date().toISOString()
  };

  recommendations.push(newRecommendation);
  res.status(201).json(newRecommendation);
});

// --- 编辑后台 API ---

// 获取待审核新闻
app.get('/api/editor/pending', (req, res) => {
  const sql = "SELECT * FROM news WHERE status = 'pending' ORDER BY publish_date DESC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ message: 'success', data: rows });
  });
});

// 审核新闻 (新漏洞点 - 审核意见)
app.post('/api/editor/review', (req, res) => {
  let { newsId, status, comment } = req.body;
  
  if (!newsId || !status) {
    return res.status(400).json({ error: '新闻ID和状态不能为空' });
  }

  if (!VULNERABILITIES_ENABLED) {
    status = escapeHtml(status);
    comment = comment ? escapeHtml(comment) : '';
  }

  res.json({
    message: '审核完成',
    newsId: parseInt(newsId),
    status,
    comment: comment || '',
    reviewedAt: new Date().toISOString()
  });
});

// --- 统计和分析 API ---

// 获取网站统计信息
app.get('/api/stats', (req, res) => {
  res.json({
    totalNews: 5,
    totalUsers: users.length,
    totalComments: comments.length + newsComments.length,
    totalFeedbacks: feedbacks.length,
    totalTags: tags.length,
    totalSubscriptions: subscriptions.length,
    totalFavorites: favorites.length
  });
});

// 获取分析数据 (新漏洞点 - 查询参数反射)
app.get('/api/analytics', (req, res) => {
  const { metric, period, filter } = req.query;
  
  if (!VULNERABILITIES_ENABLED) {
    const safeMetric = metric ? escapeHtml(metric) : '';
    const safePeriod = period ? escapeHtml(period) : '';
    const safeFilter = filter ? escapeHtml(filter) : '';
    
    res.json({
      metric: safeMetric,
      period: safePeriod,
      filter: safeFilter,
      data: []
    });
  } else {
    // 漏洞模式：直接反射参数
    res.json({
      metric: metric || '',
      period: period || '',
      filter: filter || '',
      data: []
    });
  }
});

// ============================================================================
// 产品商城 API (包含SQL注入漏洞)
// ============================================================================

// 获取所有产品列表
app.get('/api/products', (req, res) => {
  const sql = "SELECT id, name, description, price, stock, category FROM products";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// 获取产品详情 (SQL注入漏洞-3: Error-based注入)
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  // 漏洞：整数型注入，错误信息会暴露数据库结构
  const sql = `SELECT * FROM products WHERE id = ${id}`;
  
  db.get(sql, [], (err, row) => {
    if (err) {
      // 漏洞：直接返回数据库错误信息
      res.status(400).json({ "error": err.message });
      return;
    }
    
    if (row) {
      res.json({
        "message": "success",
        "data": row
      });
    } else {
      res.status(404).json({ "error": "产品不存在" });
    }
  });
});

// 搜索产品 (SQL注入漏洞-4: UNION注入)
app.get('/api/products/search', (req, res) => {
  const keyword = req.query.q || '';
  const category = req.query.category || '';
  
  let sql = `SELECT id, name, description, price, stock, category FROM products WHERE 1=1`;
  
  // 漏洞：搜索关键词直接拼接
  if (keyword) {
    sql += ` AND name LIKE '%${keyword}%'`;
  }
  
  if (category) {
    sql += ` AND category = '${category}'`;
  }
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// 更新产品库存 (SQL注入漏洞-5: UPDATE注入)
app.put('/api/products/:id/stock', (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;
  
  if (quantity === undefined) {
    return res.status(400).json({ error: '库存数量不能为空' });
  }
  
  // 漏洞：UPDATE语句直接拼接用户输入
  const sql = `UPDATE products SET stock = ${quantity} WHERE id = ${id}`;
  
  db.run(sql, [], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ "error": "产品不存在" });
    } else {
      res.json({
        "message": "库存更新成功",
        "product_id": id,
        "new_stock": quantity
      });
    }
  });
});

// ============================================================================
// 用户认证 API (包含SQL注入漏洞)
// ============================================================================

// 用户登录 (SQL注入漏洞-6: Boolean盲注)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  // 漏洞：直接拼接用户输入
  const sql = `SELECT * FROM users_db WHERE username = '${username}' AND password = '${password}'`;
  
  db.get(sql, [], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    
    if (row) {
      res.json({
        "message": "登录成功",
        "user": {
          id: row.id,
          username: row.username,
          email: row.email,
          role: row.role
        },
        "token": "fake-jwt-token-" + row.id
      });
    } else {
      res.status(401).json({ "error": "用户名或密码错误" });
    }
  });
});

// 用户注册 (SQL注入漏洞-7: INSERT注入)
app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  
  const created_at = new Date().toISOString().split('T')[0];
  
  // 漏洞：INSERT语句直接拼接用户输入
  const sql = `INSERT INTO users_db (username, password, email, role, created_at) VALUES ('${username}', '${password}', '${email || ''}', 'user', '${created_at}')`;
  
  db.run(sql, [], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "message": "注册成功",
      "user_id": this.lastID,
      "username": username
    });
  });
});

// 检查用户名是否存在 (SQL注入漏洞-8: Time-based盲注)
app.get('/api/auth/check-username/:username', (req, res) => {
  const username = req.params.username;
  // 漏洞：可以利用子查询进行盲注
  const sql = `SELECT COUNT(*) as count FROM users_db WHERE username = '${username}'`;
  
  db.get(sql, [], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "available": row.count === 0,
      "message": row.count > 0 ? "用户名已被使用" : "用户名可用"
    });
  });
});

// ============================================================================
// 订单管理 API (包含SQL注入漏洞)
// ============================================================================

// 获取用户订单列表 (SQL注入漏洞-9: JOIN查询注入)
app.get('/api/orders/user/:userId', (req, res) => {
  const userId = req.params.userId;
  // 漏洞：JOIN查询中直接拼接用户输入
  const sql = `SELECT o.id, o.quantity, o.total_price, o.status, o.order_date, 
               p.name as product_name, p.price as unit_price
               FROM orders o 
               JOIN products p ON o.product_id = p.id 
               WHERE o.user_id = ${userId}
               ORDER BY o.order_date DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// 获取所有订单 (SQL注入漏洞-10: ORDER BY注入)
app.get('/api/orders', (req, res) => {
  const sortBy = req.query.sort || 'order_date';
  const order = req.query.order || 'DESC';
  const status = req.query.status || '';
  
  // 漏洞：ORDER BY子句直接使用用户输入
  let sql = `SELECT o.id, o.user_id, o.product_id, o.quantity, o.total_price, o.status, o.order_date,
             u.username, p.name as product_name
             FROM orders o
             LEFT JOIN users_db u ON o.user_id = u.id
             LEFT JOIN products p ON o.product_id = p.id`;
  
  if (status) {
    sql += ` WHERE o.status = '${status}'`;
  }
  
  sql += ` ORDER BY ${sortBy} ${order}`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

// 删除订单 (SQL注入漏洞-11: DELETE注入)
app.delete('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  // 漏洞：DELETE语句直接拼接
  const sql = `DELETE FROM orders WHERE id = ${id}`;
  
  db.run(sql, [], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ "error": "订单不存在或已删除" });
    } else {
      res.json({
        "message": "订单删除成功",
        "deleted_count": this.changes
      });
    }
  });
});

// ============================================================================
// 用户管理 API (包含SQL注入漏洞)
// ============================================================================

// 搜索用户 (SQL注入漏洞-12: LIKE注入)
app.get('/api/users/search', (req, res) => {
  const query = req.query.q || '';
  const role = req.query.role || '';
  
  let sql = `SELECT id, username, email, role, created_at FROM users_db WHERE 1=1`;
  
  // 漏洞：LIKE查询中直接拼接用户输入
  if (query) {
    sql += ` AND (username LIKE '%${query}%' OR email LIKE '%${query}%')`;
  }
  
  if (role) {
    sql += ` AND role = '${role}'`;
  }
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.listen(PORT, () => {
  console.log(`新闻系统后端已启动，运行于 http://localhost:${PORT}`);
});