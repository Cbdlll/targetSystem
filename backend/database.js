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
        db.run(`CREATE TABLE news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT, 
            content TEXT,
            author TEXT,
            publish_date TEXT
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log('News table already exists.');
            } else {
                // Table just created, creating some rows
                console.log('News table created, seeding with initial data.');
                const insert = 'INSERT INTO news (title, content, author, publish_date) VALUES (?,?,?,?)';
                // 正常新闻
                db.run(insert, ["探索未来科技：AI如何改变我们的生活", "人工智能（AI）正以前所未有的速度融入我们生活的方方面面。从智能家居到自动驾驶汽车，AI技术正在重新定义效率和便利性。<b>本文将深入探讨AI的核心技术及其在医疗、金融和娱乐等领域的应用。</b><p>我们还将讨论AI发展所面临的伦理挑战和社会影响。</p>", "科技小编", "2025-11-14"]);
                db.run(insert, ["健康饮食新趋势：超级食物的力量", "\"超级食物\"因其丰富的营养价值而备受关注。蓝莓、奇亚籽和羽衣甘蓝等食物富含抗氧化剂、维生素和矿物质，有助于增强免疫系统、改善心血管健康。在这篇文章中，我们将介绍十种值得加入您日常饮食的超级食物。", "营养学家李明", "2025-11-13"]);
                db.run(insert, ["环球旅行：五个必去的隐藏瑰宝目的地", "厌倦了热门旅游景点？是时候去发现那些隐藏在世界角落的瑰宝了。从宁静的法罗群岛到神秘的不丹王国，我们为您精选了五个能带来独特体验的旅行目的地。准备好打包行囊，开始一场难忘的冒险吧！", "旅行家王浩", "2025-11-12"]);
                db.run(insert, ["突破性科技发现", "这是一篇关于科技突破的文章内容。更多精彩内容即将呈现。", "安全研究员", "2025-11-11"]);
                db.run(insert, ["网络安全最佳实践指南", "学习如何保护您的在线隐私和数据安全。本指南涵盖密码管理、双因素认证等重要话题。", "安全专家张伟", "2025-11-10"]);
            }
        });
    }
});

module.exports = db;
