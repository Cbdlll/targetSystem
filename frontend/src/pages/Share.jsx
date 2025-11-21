import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Share() {
  const [shares, setShares] = useState([]);
  const [news, setNews] = useState([]);
  const [newsId, setNewsId] = useState('');
  const [platform, setPlatform] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchShares();
    fetchNews();
  }, []);

  // 新漏洞点：从URL参数读取分享平台并动态创建script标签
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sharePlatform = params.get('platform');
    if (sharePlatform) {
      // 危险：动态创建script标签加载分享脚本
      const script = document.createElement('script');
      script.textContent = `console.log('分享平台: ${sharePlatform}')`;
      document.body.appendChild(script);
    }
  }, [location.search]);

  const fetchShares = async () => {
    try {
      const response = await axios.get(`${API_URL}/shares`);
      setShares(response.data);
    } catch (err) {
      console.error('获取分享记录失败', err);
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
    if (!newsId || !platform) {
      alert('新闻ID和分享平台不能为空');
      return;
    }
    try {
      await axios.post(`${API_URL}/shares`, { newsId, platform, customMessage });
      setNewsId('');
      setPlatform('');
      setCustomMessage('');
      fetchShares();
      alert('分享成功！');
    } catch (err) {
      alert('分享失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>分享新闻</h2>
      <p>将您喜欢的新闻分享到社交媒体平台。</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>分享新闻</h3>
        <form onSubmit={handleSubmit}>
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
            <label>分享平台</label>
            <select
              className="form-control"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">请选择平台</option>
              <option value="微信">微信</option>
              <option value="微博">微博</option>
              <option value="Twitter">Twitter</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div className="form-group">
            <label>自定义消息</label>
            <textarea
              className="form-control"
              rows="3"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="添加分享时的自定义消息（可选）"
            />
          </div>
          <button type="submit" className="btn btn-primary">分享</button>
        </form>
      </div>

      <h3>分享记录</h3>
      {shares.length > 0 ? (
        <div>
          {shares.map(share => {
            const article = news.find(n => n.id === share.newsId);
            return (
              <div key={share.id} className="card mb-3">
                <div className="card-body">
                  <h5>
                    平台：<span dangerouslySetInnerHTML={{ __html: share.platform }}></span>
                  </h5>
                  <p>新闻：{article ? article.title : `新闻 #${share.newsId}`}</p>
                  {/* 新漏洞点：自定义消息存储型XSS */}
                  {share.customMessage && (
                    <p dangerouslySetInnerHTML={{ __html: share.customMessage }}></p>
                  )}
                  <small className="text-muted">
                    分享时间：{new Date(share.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>还没有分享记录。</p>
      )}
    </div>
  );
}

export default Share;

