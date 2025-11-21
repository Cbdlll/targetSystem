import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Editor() {
  const [pendingNews, setPendingNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [status, setStatus] = useState('approved');
  const [comment, setComment] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchPendingNews();
  }, []);

  // 新漏洞点：从URL参数读取审核意见并使用document.write
  const handlePrintReview = () => {
    const params = new URLSearchParams(location.search);
    const reviewNote = params.get('review');
    if (reviewNote) {
      // 危险：使用document.write输出审核意见
      document.write(`<h3>审核意见预览</h3><p>${reviewNote}</p>`);
    }
  };

  const fetchPendingNews = async () => {
    try {
      const response = await axios.get(`${API_URL}/editor/pending`);
      setPendingNews(response.data.data || []);
    } catch (err) {
      console.error('获取待审核新闻失败', err);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!selectedNews || !status) {
      alert('请选择新闻并设置审核状态');
      return;
    }
    try {
      await axios.post(`${API_URL}/editor/review`, {
        newsId: selectedNews.id,
        status,
        comment
      });
      alert('审核完成！');
      setSelectedNews(null);
      setComment('');
      setStatus('approved');
      fetchPendingNews();
    } catch (err) {
      alert('审核失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>编辑后台</h2>
      <p>审核和管理待发布的新闻文章。</p>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <button className="btn btn-info" onClick={handlePrintReview}>
          打印审核意见预览
        </button>
        <small className="d-block mt-2">提示：此功能会使用URL参数动态加载内容。</small>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div>
          <h3>待审核新闻</h3>
          {pendingNews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pendingNews.map(article => (
                <div
                  key={article.id}
                  onClick={() => setSelectedNews(article)}
                  style={{
                    padding: '1rem',
                    background: selectedNews?.id === article.id ? '#e3f2fd' : '#f8f9fa',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedNews?.id === article.id ? '2px solid #2196f3' : '1px solid #ddd'
                  }}
                >
                  <strong>{article.title}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                    {article.author} - {article.publish_date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>没有待审核的新闻。</p>
          )}
        </div>

        <div>
          {selectedNews ? (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>审核新闻</h3>
              <div style={{ marginBottom: '1rem' }}>
                <strong>标题：</strong> {selectedNews.title}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>作者：</strong> {selectedNews.author}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>内容：</strong>
                <div dangerouslySetInnerHTML={{ __html: selectedNews.content }}></div>
              </div>

              <form onSubmit={handleReview}>
                <div className="form-group">
                  <label>审核状态</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="approved">通过</option>
                    <option value="rejected">拒绝</option>
                    <option value="pending">待修改</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>审核意见</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="输入审核意见..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">提交审核</button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              请从左侧选择一篇新闻进行审核
            </div>
          )}
        </div>
      </div>

      {selectedNews && comment && (
        <div className="card mt-3" style={{ padding: '1.5rem', background: '#fff3cd' }}>
          <h4>审核意见预览</h4>
          {/* 新漏洞点：审核意见存储型XSS */}
          <div dangerouslySetInnerHTML={{ __html: comment }}></div>
        </div>
      )}
    </div>
  );
}

export default Editor;

