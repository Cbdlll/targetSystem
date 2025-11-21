import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function RSS() {
  const [feeds, setFeeds] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchFeeds();
  }, []);

  // 新漏洞点：从URL参数读取RSS源名称并使用setTimeout执行
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const feedName = params.get('feed');
    if (feedName) {
      // 危险：setTimeout中使用用户输入
      setTimeout(`console.log('RSS源: ${feedName}')`, 1000);
    }
  }, [location.search]);

  const fetchFeeds = async () => {
    try {
      const response = await axios.get(`${API_URL}/rss`);
      setFeeds(response.data);
    } catch (err) {
      console.error('获取RSS源失败', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !url) {
      alert('名称和URL不能为空');
      return;
    }
    try {
      await axios.post(`${API_URL}/rss`, { name, url, description });
      setName('');
      setUrl('');
      setDescription('');
      fetchFeeds();
    } catch (err) {
      alert('添加RSS源失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>RSS订阅管理</h2>
      <p>添加和管理RSS订阅源，自动获取最新内容。</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>添加RSS源</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RSS源名称</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入RSS源名称"
            />
          </div>
          <div className="form-group">
            <label>RSS URL</label>
            <input
              type="url"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/rss"
            />
          </div>
          <div className="form-group">
            <label>描述</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入RSS源描述（可选）"
            />
          </div>
          <button type="submit" className="btn btn-primary">添加RSS源</button>
        </form>
      </div>

      <h3>RSS订阅源列表</h3>
      {feeds.length > 0 ? (
        <div>
          {feeds.map(feed => (
            <div key={feed.id} className="card mb-3">
              <div className="card-body">
                <h5 dangerouslySetInnerHTML={{ __html: feed.name }}></h5>
                <p><strong>URL:</strong> {feed.url}</p>
                {/* 新漏洞点：RSS描述存储型XSS */}
                {feed.description && (
                  <p dangerouslySetInnerHTML={{ __html: feed.description }}></p>
                )}
                <small className="text-muted">
                  添加时间：{new Date(feed.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>还没有添加RSS订阅源。</p>
      )}
    </div>
  );
}

export default RSS;

