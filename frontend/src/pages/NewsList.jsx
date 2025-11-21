import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function NewsList() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/news`);
        setNews(response.data.data);
      } catch (err) {
        setError('无法加载新闻列表，请稍后再试。');
        console.error(err);
      }
    };
    fetchNews();
  }, []);

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

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="page-title" id="dynamic-title">最新新闻</h2>
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
