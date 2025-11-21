import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function NewsDetail() {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const { id } = useParams();

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`${API_URL}/news/${id}`);
      setArticle(response.data.data);
    } catch (err) {
      setError('无法加载新闻文章，可能已被删除或链接无效。');
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/news/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('获取评论失败', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.author || !newComment.content) {
      alert('请填写姓名和评论内容');
      return;
    }

    try {
      await axios.post(`${API_URL}/news/${id}/comments`, newComment);
      setNewComment({ author: '', content: '' });
      fetchComments();
    } catch (err) {
      alert('发表评论失败');
      console.error(err);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!article) {
    return <p>正在加载文章...</p>;
  }

  return (
    <div className="news-detail">
      <Link to="/">&larr; 返回新闻列表</Link>
      <h1 className="article-title" dangerouslySetInnerHTML={{ __html: article.title }}></h1>
      <div className="news-meta">
        <span>作者：<span dangerouslySetInnerHTML={{ __html: article.author }}></span></span> | <span>日期：{new Date(article.publish_date).toLocaleDateString()}</span>
      </div>
      <hr />
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      >
      </div>

      {/* 评论区 */}
      <div style={{ marginTop: '3rem' }}>
        <h3>评论区 ({comments.length})</h3>
        
        {/* V22: 存储型XSS - 评论显示 */}
        {comments.length > 0 ? (
          <div style={{ marginBottom: '2rem' }}>
            {comments.map(comment => (
              <div key={comment.id} className="card mb-3">
                <div className="card-body">
                  <h5 dangerouslySetInnerHTML={{ __html: comment.author }}></h5>
                  <p dangerouslySetInnerHTML={{ __html: comment.content }}></p>
                  <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#999', marginBottom: '2rem' }}>暂无评论，快来发表第一条评论吧！</p>
        )}

        {/* 发表评论表单 */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4>发表评论</h4>
          <form onSubmit={handleSubmitComment}>
            <div className="form-group">
              <label>姓名</label>
              <input
                type="text"
                className="form-control"
                value={newComment.author}
                onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                placeholder="请输入您的姓名"
              />
            </div>
            <div className="form-group">
              <label>评论内容</label>
              <textarea
                className="form-control"
                rows="4"
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                placeholder="分享您的看法..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">发表评论</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
