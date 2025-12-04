import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [checkUsername, setCheckUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:3001';

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (data.message && data.user) {
        setMessage(`登录成功！欢迎 ${data.user.username} (${data.user.role})`);
        // 保存用户信息到localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // 2秒后跳转到首页
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage(`登录失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      setMessage(`登录失败: ${error.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('两次输入的密码不一致');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email
        })
      });

      const data = await response.json();
      
      if (data.message && data.user_id) {
        setMessage(`注册成功！用户ID: ${data.user_id}，请登录`);
        // 3秒后切换到登录
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
        }, 3000);
      } else {
        setMessage(`注册失败: ${data.error || '未知错误'}`);
      }
    } catch (error) {
      setMessage(`注册失败: ${error.message}`);
    }
  };

  const handleCheckUsername = async () => {
    if (!checkUsername) {
      setUsernameStatus('请输入用户名');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/check-username/${encodeURIComponent(checkUsername)}`);
      const data = await response.json();
      
      if (data.available !== undefined) {
        setUsernameStatus(data.message);
      } else if (data.error) {
        setUsernameStatus(`错误: ${data.error}`);
      }
    } catch (error) {
      setUsernameStatus(`检查失败: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '40px auto', 
      padding: '20px' 
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          {isLogin ? '用户登录' : '用户注册'}
        </h1>

        {/* 切换按钮 */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: isLogin ? '#007bff' : 'transparent',
              color: isLogin ? '#fff' : '#666',
              border: 'none',
              borderBottom: isLogin ? '3px solid #007bff' : 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            登录
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: !isLogin ? '#007bff' : 'transparent',
              color: !isLogin ? '#fff' : '#666',
              border: 'none',
              borderBottom: !isLogin ? '3px solid #007bff' : 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            注册
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: message.includes('成功') ? '#d4edda' : '#f8d7da',
            color: message.includes('成功') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('成功') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        {/* 登录表单 */}
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                用户名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                密码
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              登录
            </button>
            <p style={{ 
              marginTop: '15px', 
              fontSize: '14px', 
              color: '#666',
              textAlign: 'center'
            }}>
              测试账号: admin / admin123
            </p>
          </form>
        ) : (
          /* 注册表单 */
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                用户名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="请输入用户名"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                邮箱
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="请输入邮箱"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                密码
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                确认密码
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="请再次输入密码"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              注册
            </button>
          </form>
        )}

        {/* 用户名检查工具 */}
        {!isLogin && (
          <div style={{ 
            marginTop: '30px', 
            padding: '15px', 
            backgroundColor: '#f8f9fa',
            borderRadius: '4px'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>检查用户名是否可用</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={checkUsername}
                onChange={(e) => setCheckUsername(e.target.value)}
                placeholder="输入用户名检查"
                style={{ 
                  flex: 1, 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleCheckUsername}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#17a2b8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                检查
              </button>
            </div>
            {usernameStatus && (
              <p style={{ 
                marginTop: '10px', 
                marginBottom: 0,
                fontSize: '14px',
                color: usernameStatus.includes('可用') ? '#28a745' : '#dc3545'
              }}>
                {usernameStatus}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

