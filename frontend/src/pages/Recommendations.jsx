import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [news, setNews] = useState([]);
  const [userId, setUserId] = useState('1');
  const [newsId, setNewsId] = useState('');
  const [reason, setReason] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchRecommendations();
    fetchNews();
  }, []);

  // 新漏洞点：从URL hash读取推荐理由并设置location.href
  useEffect(() => {
    if (location.hash.startsWith('#reason=')) {
      const reasonValue = decodeURIComponent(location.hash.substring(8));
      // 危险：使用location.href跳转
      setTimeout(() => {
        window.location.href = `#recommendation-${reasonValue}`;
      }, 500);
    }
  }, [location.hash]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations?userId=${userId}`);
      setRecommendations(response.data);
    } catch (err) {
      console.error('获取推荐失败', err);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API_URL}/news`);
      setNews(response.data.data || []);
    } catch (err) {
      console.error('获取新闻失败', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !newsId) {
      alert('用户ID和新闻ID不能为空');
      return;
    }
    try {
      await axios.post(`${API_URL}/recommendations`, { userId, newsId, reason });
      setNewsId('');
      setReason('');
      fetchRecommendations();
    } catch (err) {
      alert('创建推荐失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>推荐系统</h2>
      <p>为用户推荐感兴趣的新闻内容。</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>创建推荐</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户ID</label>
            <input
              type="number"
              className="form-control"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                fetchRecommendations();
              }}
            />
          </div>
          <div className="form-group">
            <label>推荐新闻</label>
            <select
              className="form-control"
              value={newsId}
              onChange={(e) => setNewsId(e.target.value)}
            >
              <option value="">请选择新闻</option>
              {news.map(article => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>推荐理由</label>
            <textarea
              className="form-control"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="说明推荐此新闻的理由..."
            />
          </div>
          <button type="submit" className="btn btn-primary">创建推荐</button>
        </form>
      </div>

      <h3>推荐列表</h3>
      {recommendations.length > 0 ? (
        <div>
          {recommendations.map(rec => {
            const article = news.find(n => n.id === rec.newsId);
            return (
              <div key={rec.id} id={`recommendation-${rec.id}`} className="card mb-3">
                <div className="card-body">
                  <h5>{article ? article.title : `新闻 #${rec.newsId}`}</h5>
                  {/* 新漏洞点：推荐理由存储型XSS */}
                  {rec.reason && (
                    <div dangerouslySetInnerHTML={{ __html: rec.reason }}></div>
                  )}
                  <small className="text-muted">
                    推荐时间：{new Date(rec.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>还没有推荐内容。</p>
      )}
    </div>
  );
}

export default Recommendations;

