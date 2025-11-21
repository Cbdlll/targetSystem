import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Tags() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#007bff');
  const location = useLocation();

  useEffect(() => {
    fetchTags();
  }, []);

  // 新漏洞点：从URL参数读取标签名称并显示
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagName = params.get('tag');
    if (tagName) {
      const tagDisplay = document.getElementById('tag-display');
      if (tagDisplay) {
        tagDisplay.innerHTML = `当前查看标签: ${tagName}`;
      }
    }
  }, [location.search]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/tags`);
      setTags(response.data);
    } catch (err) {
      console.error('获取标签失败', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert('标签名称不能为空');
      return;
    }
    try {
      await axios.post(`${API_URL}/tags`, { name, description, color });
      setName('');
      setDescription('');
      setColor('#007bff');
      fetchTags();
    } catch (err) {
      alert('创建标签失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>标签管理</h2>
      <p>创建和管理新闻标签，方便分类和检索。</p>

      <div id="tag-display" style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}></div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>创建新标签</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>标签名称</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入标签名称"
            />
          </div>
          <div className="form-group">
            <label>标签描述</label>
            <textarea
              className="form-control"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入标签描述（可选）"
            />
          </div>
          <div className="form-group">
            <label>标签颜色</label>
            <input
              type="color"
              className="form-control"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">创建标签</button>
        </form>
      </div>

      <h3>所有标签</h3>
      {tags.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map(tag => (
            <span
              key={tag.id}
              className="badge"
              style={{
                backgroundColor: tag.color,
                color: 'white',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem'
              }}
            >
              {/* 新漏洞点：标签名称存储型XSS */}
              <span dangerouslySetInnerHTML={{ __html: tag.name }}></span>
              {tag.description && (
                <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>
                  - {tag.description}
                </span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <p>还没有标签，快来创建第一个吧！</p>
      )}
    </div>
  );
}

export default Tags;

