import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserCenter() {
  const navigate = useNavigate();

  const features = [
    {
      title: '个人资料',
      description: '查看和编辑你的个人信息、头像和简介',
      icon: '👤',
      color: '#007bff',
      path: '/profile',
      stats: '个人信息'
    },
    {
      title: '我的收藏',
      description: '管理你收藏的新闻和文章，添加备注',
      icon: '⭐',
      color: '#ffc107',
      path: '/favorites',
      stats: '收藏管理'
    },
    {
      title: '我的订阅',
      description: '查看和管理你订阅的新闻分类和主题',
      icon: '🔔',
      color: '#28a745',
      path: '/subscriptions',
      stats: '订阅通知'
    },
    {
      title: '内容推荐',
      description: '根据你的兴趣为你推荐精彩内容',
      icon: '✨',
      color: '#e83e8c',
      path: '/recommendations',
      stats: '个性推荐'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#333' }}>
          👨‍💼 个人中心
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          管理你的个人信息和偏好设置
        </p>
      </div>

      {/* 用户信息卡片 */}
      <div style={{
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '40px',
        color: '#fff',
        boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            👤
          </div>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '28px' }}>欢迎回来！</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>查看你的最新动态和推荐内容</p>
          </div>
        </div>
      </div>

      {/* 功能卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px',
        marginBottom: '50px'
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => navigate(feature.path)}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.borderColor = feature.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            {/* 图标和标签 */}
            <div style={{ 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '48px' }}>{feature.icon}</div>
              <span style={{
                backgroundColor: feature.color + '20',
                color: feature.color,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {feature.stats}
              </span>
            </div>

            {/* 标题 */}
            <h3 style={{ 
              fontSize: '22px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              {feature.title}
            </h3>

            {/* 描述 */}
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {feature.description}
            </p>

            {/* 进入按钮 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: feature.color,
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              查看 →
            </div>
          </div>
        ))}
      </div>

      {/* 快速操作 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>⚡ 快速操作</h3>
        <div style={{ 
          display: 'flex', 
          gap: '15px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            编辑资料
          </button>
          <button
            onClick={() => navigate('/favorites')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0a800'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
          >
            查看收藏
          </button>
          <button
            onClick={() => navigate('/subscriptions')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
          >
            管理订阅
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCenter;

