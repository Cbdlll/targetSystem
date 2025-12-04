const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保data目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const DBSOURCE = path.join(dataDir, "news.db");

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        
        // 创建新闻表
        db.run(`CREATE TABLE news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            content TEXT,
            author TEXT,
            publish_date TEXT,
            category TEXT DEFAULT '未分类',
            views INTEGER DEFAULT 0,
            status TEXT DEFAULT 'published'
            )`,
        (err) => {
            if (err) {
                console.log('News table already exists.');
            } else {
                console.log('News table created, seeding with initial data.');
                const insert = 'INSERT INTO news (title, content, author, publish_date, category, views, status) VALUES (?,?,?,?,?,?,?)';
                db.run(insert, ["探索未来科技：AI如何改变我们的生活", "人工智能（AI）正以前所未有的速度融入我们生活的方方面面。从智能家居到自动驾驶汽车，AI技术正在重新定义效率和便利性。<b>本文将深入探讨AI的核心技术及其在医疗、金融和娱乐等领域的应用。</b><p>我们还将讨论AI发展所面临的伦理挑战和社会影响。</p>", "科技小编", "2025-11-14", "科技", 1523, "published"]);
                db.run(insert, ["健康饮食新趋势：超级食物的力量", "\"超级食物\"因其丰富的营养价值而备受关注。蓝莓、奇亚籽和羽衣甘蓝等食物富含抗氧化剂、维生素和矿物质，有助于增强免疫系统、改善心血管健康。在这篇文章中，我们将介绍十种值得加入您日常饮食的超级食物。", "营养学家李明", "2025-11-13", "健康", 892, "published"]);
                db.run(insert, ["环球旅行：五个必去的隐藏瑰宝目的地", "厌倦了热门旅游景点？是时候去发现那些隐藏在世界角落的瑰宝了。从宁静的法罗群岛到神秘的不丹王国，我们为您精选了五个能带来独特体验的旅行目的地。准备好打包行囊，开始一场难忘的冒险吧！", "旅行家王浩", "2025-11-12", "旅游", 756, "published"]);
                db.run(insert, ["突破性科技发现", "这是一篇关于科技突破的文章内容。更多精彩内容即将呈现。", "安全研究员", "2025-11-11", "科技", 432, "published"]);
                db.run(insert, ["网络安全最佳实践指南", "学习如何保护您的在线隐私和数据安全。本指南涵盖密码管理、双因素认证等重要话题。", "安全专家张伟", "2025-11-10", "科技", 654, "published"]);
            }
        });
        
        // 创建用户表（用于SQL注入测试）
        db.run(`CREATE TABLE users_db (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            role TEXT DEFAULT 'user',
            created_at TEXT
            )`,
        (err) => {
            if (err) {
                console.log('Users_db table already exists.');
            } else {
                console.log('Users_db table created, seeding with initial data.');
                const insert = 'INSERT INTO users_db (username, password, email, role, created_at) VALUES (?,?,?,?,?)';
                db.run(insert, ["admin", "admin123", "admin@news.com", "admin", "2025-01-01"]);
                db.run(insert, ["editor", "editor456", "editor@news.com", "editor", "2025-01-02"]);
                db.run(insert, ["user1", "pass123", "user1@example.com", "user", "2025-01-03"]);
                db.run(insert, ["user2", "pass456", "user2@example.com", "user", "2025-01-04"]);
                db.run(insert, ["testuser", "test789", "test@example.com", "user", "2025-01-05"]);
            }
        });
        
        // 创建产品表（用于SQL注入测试）
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL,
            stock INTEGER DEFAULT 0,
            category TEXT
            )`,
        (err) => {
            if (err) {
                console.log('Products table already exists.');
            } else {
                console.log('Products table created, seeding with initial data.');
                const insert = 'INSERT INTO products (name, description, price, stock, category) VALUES (?,?,?,?,?)';
                db.run(insert, ["笔记本电脑", "高性能办公笔记本", 5999.00, 50, "电子产品"]);
                db.run(insert, ["无线鼠标", "人体工学设计无线鼠标", 99.00, 200, "电子产品"]);
                db.run(insert, ["机械键盘", "青轴机械键盘", 399.00, 80, "电子产品"]);
                db.run(insert, ["显示器", "27英寸4K显示器", 2499.00, 30, "电子产品"]);
                db.run(insert, ["USB-C数据线", "快充数据线", 29.00, 500, "配件"]);
            }
        });
        
        // 创建订单表（用于SQL注入测试）
        db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            total_price REAL,
            status TEXT DEFAULT 'pending',
            order_date TEXT
            )`,
        (err) => {
            if (err) {
                console.log('Orders table already exists.');
            } else {
                console.log('Orders table created, seeding with initial data.');
                const insert = 'INSERT INTO orders (user_id, product_id, quantity, total_price, status, order_date) VALUES (?,?,?,?,?,?)';
                db.run(insert, [1, 1, 1, 5999.00, "completed", "2025-11-01"]);
                db.run(insert, [2, 2, 2, 198.00, "completed", "2025-11-02"]);
                db.run(insert, [3, 3, 1, 399.00, "pending", "2025-11-10"]);
                db.run(insert, [1, 4, 1, 2499.00, "shipped", "2025-11-15"]);
            }
        });
        
        // 创建日志表（用于SQL注入测试）
        db.run(`CREATE TABLE logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT,
            ip_address TEXT,
            user_agent TEXT,
            created_at TEXT
            )`,
        (err) => {
            if (err) {
                console.log('Logs table already exists.');
            } else {
                console.log('Logs table created, seeding with initial data.');
                const insert = 'INSERT INTO logs (user_id, action, ip_address, user_agent, created_at) VALUES (?,?,?,?,?)';
                db.run(insert, [1, "login", "192.168.1.1", "Mozilla/5.0", "2025-11-20 10:00:00"]);
                db.run(insert, [2, "view_article", "192.168.1.2", "Chrome/120.0", "2025-11-20 11:30:00"]);
                db.run(insert, [3, "logout", "192.168.1.3", "Firefox/120.0", "2025-11-20 14:00:00"]);
            }
        });
    }
});

module.exports = db;
