import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function Guestbook() {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments`);
      setComments(response.data.reverse()); // 显示最新留言
    } catch (err) {
      setError('无法加载留言');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !content) {
      setError('请填写您的姓名和留言内容。');
      return;
    }
    try {
      await axios.post(`${API_URL}/comments`, { username, content });
      setUsername('');
      setContent('');
      setError('');
      fetchComments(); // 重新加载留言
    } catch (err) {
      setError('发表留言失败。');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>留言板</h2>
      <p>在这里留下你的足迹，内容对所有人可见。</p>
      
      <div className="card" style={{ padding: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">姓名</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入你的名字"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">留言</label>
            <textarea
              id="content"
              className="form-control"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="说点什么吧..."
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">发表留言</button>
        </form>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <h3>所有留言</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="card mb-3" data-username={comment.username}>
            <div className="card-body">
              <h5 className="card-title" dangerouslySetInnerHTML={{ __html: comment.username }}></h5>
              <p className="card-text" dangerouslySetInnerHTML={{ __html: comment.content }}></p>
              <small className="text-muted">{new Date(comment.createdAt).toLocaleString()}</small>
              <button 
                className="btn btn-sm btn-link" 
                onClick={() => alert(`正在举报用户: ${comment.username}`)}
                style={{ marginLeft: '1rem', textDecoration: 'none' }}
              >
                举报
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>还没有留言，快来抢沙发！</p>
      )}
    </div>
  );
}

export default Guestbook;
