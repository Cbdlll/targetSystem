import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function NewsList() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('获取分类失败:', err);
      }
    };
    fetchCategories();
  }, []);

  // 获取新闻列表
  useEffect(() => {
    const fetchNews = async () => {
      try {
        let url = `${API_URL}/news`;
        // SQL注入漏洞-2: 按分类筛选时使用易受攻击的端点
        if (selectedCategory) {
          url = `${API_URL}/news/category/${selectedCategory}`;
        }
        const response = await axios.get(url);
        setNews(response.data.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || '无法加载新闻列表，请稍后再试。');
        console.error(err);
      }
    };
    fetchNews();
  }, [selectedCategory]);

  // V13: DOM型XSS - 使用URL参数动态设置页面标题
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageTitle = params.get('title');
    if (pageTitle) {
      // 危险：直接使用innerHTML设置标题
      const titleElement = document.getElementById('dynamic-title');
      if (titleElement) {
        titleElement.innerHTML = pageTitle;
      }
    }
  }, [location.search]);

  // V14: DOM型XSS - 从URL hash中读取并执行
  useEffect(() => {
    if (location.hash.startsWith('#filter=')) {
      const filter = decodeURIComponent(location.hash.substring(8));
      // 危险：使用eval处理过滤器
      try {
        eval(`console.log('过滤器: ${filter}')`);
      } catch (e) {
        console.error('过滤器错误', e);
      }
    }
  }, [location.hash]);

  return (
    <div>
      <h2 className="page-title" id="dynamic-title">最新新闻</h2>
      
      {/* 分类筛选 - SQL注入漏洞-2的入口 */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>按分类筛选：</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            borderRadius: '4px', 
            border: '1px solid #ddd',
            marginRight: '10px',
            minWidth: '150px'
          }}
        >
          <option value="">全部分类</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        {selectedCategory && (
          <button 
            onClick={() => setSelectedCategory('')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            清除筛选
          </button>
        )}
        {selectedCategory && (
          <span style={{ marginLeft: '15px', color: '#666' }}>
            当前分类：<strong>{selectedCategory}</strong>
          </span>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="news-list">
        {news.length > 0 ? (
          news.map((article) => (
            <div key={article.id} className="news-list-item">
              <h3 className="news-title">
                <Link to={`/news/${article.id}`} dangerouslySetInnerHTML={{ __html: article.title }}></Link>
              </h3>
              <div className="news-meta">
                {/* V15: 存储型XSS - 作者名在属性中 */}
                <span data-author={article.author}>作者：</span>
                <span dangerouslySetInnerHTML={{ __html: article.author }}></span> | 
                <span>日期：{new Date(article.publish_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p>正在加载新闻...</p>
        )}
      </div>
    </div>
  );
}

export default NewsList;
