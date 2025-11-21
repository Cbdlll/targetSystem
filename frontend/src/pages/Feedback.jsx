import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      setFeedbacks(response.data.reverse());
    } catch (err) {
      console.error('无法加载反馈', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('请填写所有字段。');
      return;
    }
    try {
      await axios.post(`${API_URL}/feedback`, { name, email, message });
      setName('');
      setEmail('');
      setMessage('');
      setError('');
      setSuccess('感谢您的反馈！');
      fetchFeedbacks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('提交反馈失败。');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>用户反馈</h2>
      <p>我们重视您的意见，请留下您的宝贵建议。</p>
      
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的姓名"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="text"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的邮箱"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">反馈内容</label>
            <textarea
              id="message"
              className="form-control"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="请描述您的问题或建议..."
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary">提交反馈</button>
        </form>
      </div>

      <h3>最近的反馈</h3>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <div key={feedback.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{feedback.name}</h5>
              {/* V18: 存储型XSS - email字段被危险地渲染 */}
              <p className="text-muted">
                联系邮箱: <span dangerouslySetInnerHTML={{ __html: feedback.email }}></span>
              </p>
              <p className="card-text">{feedback.message}</p>
              <small className="text-muted">{new Date(feedback.createdAt).toLocaleString()}</small>
            </div>
          </div>
        ))
      ) : (
        <p>暂无反馈记录。</p>
      )}
    </div>
  );
}

export default Feedback;

