import React from 'react';
import { useNavigate } from 'react-router-dom';

function CommunityHub() {
  const navigate = useNavigate();

  const features = [
    {
      title: '留言板',
      description: '与其他用户交流互动，发表你的想法和评论',
      icon: '💬',
      color: '#17a2b8',
      path: '/guestbook',
      stats: '实时互动'
    },
    {
      title: 'RSS订阅',
      description: '添加和管理你的RSS订阅源，获取最新资讯',
      icon: '📡',
      color: '#fd7e14',
      path: '/rss',
      stats: 'RSS源'
    },
    {
      title: '分享中心',
      description: '分享你喜欢的内容到各大社交平台',
      icon: '📤',
      color: '#6c757d',
      path: '/share',
      stats: '社交分享'
    },
    {
      title: '反馈建议',
      description: '向我们提交你的建议和问题反馈',
      icon: '📝',
      color: '#6f42c1',
      path: '/feedback',
      stats: '用户反馈'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#333' }}>
          🌐 社区互动
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          与用户交流，分享精彩内容
        </p>
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
              进入 →
            </div>
          </div>
        ))}
      </div>

      {/* 社区活动 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>🎉 社区活动</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            borderLeft: '4px solid #17a2b8'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>最新留言</div>
            <div style={{ color: '#666', fontSize: '14px' }}>查看用户最新的留言和评论</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            borderLeft: '4px solid #fd7e14'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>热门订阅</div>
            <div style={{ color: '#666', fontSize: '14px' }}>发现最受欢迎的RSS订阅源</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            borderLeft: '4px solid #6f42c1'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>用户反馈</div>
            <div style={{ color: '#666', fontSize: '14px' }}>查看其他用户的建议和反馈</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityHub;


