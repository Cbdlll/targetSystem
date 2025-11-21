import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [news, setNews] = useState([]);
  const [userId, setUserId] = useState('1');
  const [newsId, setNewsId] = useState('');
  const [note, setNote] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchFavorites();
    fetchNews();
  }, []);

  // 新漏洞点：从URL参数读取用户ID并动态设置
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get('user');
    if (userParam) {
      const userDisplay = document.getElementById('user-display');
      if (userDisplay) {
        userDisplay.innerHTML = `当前用户: ${userParam}`;
      }
    }
  }, [location.search]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_URL}/favorites?userId=${userId}`);
      setFavorites(response.data);
    } catch (err) {
      console.error('获取收藏失败', err);
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
      await axios.post(`${API_URL}/favorites`, { userId, newsId, note });
      setNewsId('');
      setNote('');
      fetchFavorites();
    } catch (err) {
      alert('添加收藏失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>我的收藏</h2>
      <p>收藏您喜欢的新闻文章，方便随时查看。</p>

      <div id="user-display" style={{ marginBottom: '1rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}></div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>添加收藏</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户ID</label>
            <input
              type="number"
              className="form-control"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                fetchFavorites();
              }}
            />
          </div>
          <div className="form-group">
            <label>选择新闻</label>
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
            <label>备注</label>
            <textarea
              className="form-control"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加收藏备注（可选）"
            />
          </div>
          <button type="submit" className="btn btn-primary">添加收藏</button>
        </form>
      </div>

      <h3>收藏列表</h3>
      {favorites.length > 0 ? (
        <div>
          {favorites.map(fav => {
            const article = news.find(n => n.id === fav.newsId);
            return (
              <div key={fav.id} className="card mb-3">
                <div className="card-body">
                  <h5>{article ? article.title : `新闻 #${fav.newsId}`}</h5>
                  {/* 新漏洞点：收藏备注存储型XSS */}
                  {fav.note && (
                    <p dangerouslySetInnerHTML={{ __html: fav.note }}></p>
                  )}
                  <small className="text-muted">
                    收藏时间：{new Date(fav.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>您还没有收藏任何文章。</p>
      )}
    </div>
  );
}

export default Favorites;

