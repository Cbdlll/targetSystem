import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', bio: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (err) {
      console.error('获取用户失败', err);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setSelectedUser(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        bio: response.data.bio
      });
    } catch (err) {
      console.error('获取用户详情失败', err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.put(`${API_URL}/users/${selectedUser.id}`, formData);
      alert('用户信息更新成功！');
      fetchUsers();
      setEditMode(false);
    } catch (err) {
      alert('更新失败');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>用户管理中心</h2>
      <p>查看和管理系统用户信息</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <h3>用户列表</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                style={{
                  padding: '1rem',
                  background: selectedUser?.id === user.id ? '#e3f2fd' : '#f8f9fa',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: selectedUser?.id === user.id ? '2px solid #2196f3' : '1px solid #ddd'
                }}
              >
                <strong>{user.username}</strong>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {user.role}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedUser ? (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3>用户详情</h3>
              
              {!editMode ? (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>用户名：</strong> {selectedUser.username}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>邮箱：</strong> {selectedUser.email}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>角色：</strong> {selectedUser.role}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>个人简介：</strong>
                    {/* V21: 存储型XSS - bio字段被危险地渲染 */}
                    <div dangerouslySetInnerHTML={{ __html: selectedUser.bio }}></div>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setEditMode(true)}
                  >
                    编辑资料
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateUser}>
                  <div className="form-group">
                    <label>用户名</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>邮箱</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>个人简介</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="介绍一下自己..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{marginRight: '10px'}}>
                    保存
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setEditMode(false)}
                  >
                    取消
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              请从左侧选择一个用户查看详情
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;

