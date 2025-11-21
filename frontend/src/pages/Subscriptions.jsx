import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userId, setUserId] = useState('1');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // 新漏洞点：从URL hash读取订阅分类并执行
  useEffect(() => {
    if (location.hash.startsWith('#category=')) {
      const categoryValue = decodeURIComponent(location.hash.substring(10));
      // 危险：使用eval处理分类过滤逻辑
      try {
        eval(`console.log('订阅分类: ${categoryValue}')`);
      } catch (e) {
        console.error('分类处理错误', e);
      }
    }
  }, [location.hash]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/subscriptions`);
      setSubscriptions(response.data);
    } catch (err) {
      console.error('获取订阅失败', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !category) {
      alert('用户ID和分类不能为空');
      return;
    }
    try {
      await axios.post(`${API_URL}/subscriptions`, { userId, category, note });
      setCategory('');
      setNote('');
      fetchSubscriptions();
    } catch (err) {
      alert('创建订阅失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>订阅管理</h2>
      <p>订阅您感兴趣的新闻分类，及时接收最新资讯。</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>创建新订阅</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户ID</label>
            <input
              type="number"
              className="form-control"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>订阅分类</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">请选择分类</option>
              <option value="科技">科技</option>
              <option value="健康">健康</option>
              <option value="旅游">旅游</option>
              <option value="财经">财经</option>
              <option value="娱乐">娱乐</option>
              <option value="体育">体育</option>
              <option value="教育">教育</option>
            </select>
          </div>
          <div className="form-group">
            <label>备注</label>
            <textarea
              className="form-control"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加订阅备注（可选）"
            />
          </div>
          <button type="submit" className="btn btn-primary">创建订阅</button>
        </form>
      </div>

      <h3>我的订阅</h3>
      {subscriptions.length > 0 ? (
        <div>
          {subscriptions.map(sub => (
            <div key={sub.id} className="card mb-3">
              <div className="card-body">
                <h5>分类：{sub.category}</h5>
                {/* 新漏洞点：订阅备注存储型XSS */}
                {sub.note && (
                  <p dangerouslySetInnerHTML={{ __html: sub.note }}></p>
                )}
                <small className="text-muted">
                  创建时间：{new Date(sub.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>您还没有订阅任何分类。</p>
      )}
    </div>
  );
}

export default Subscriptions;

