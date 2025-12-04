import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminHub() {
  const navigate = useNavigate();

  const features = [
    {
      title: '编辑审核',
      description: '审核待发布的新闻文章，管理内容发布流程',
      icon: '📝',
      color: '#007bff',
      path: '/editor',
      stats: '内容管理'
    },
    {
      title: '数据分析',
      description: '查看网站数据统计和用户行为分析报表',
      icon: '📊',
      color: '#28a745',
      path: '/analytics',
      stats: '数据洞察'
    },
    {
      title: '用户管理',
      description: '管理用户账户，搜索和查看用户信息',
      icon: '👥',
      color: '#dc3545',
      path: '/users',
      stats: '用户中心'
    },
    {
      title: '标签管理',
      description: '创建和管理新闻标签，设置标签颜色',
      icon: '🏷️',
      color: '#ffc107',
      path: '/tags',
      stats: '标签系统'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#333' }}>
          🔧 管理后台
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          系统管理和数据分析中心
        </p>
      </div>

      {/* 管理员信息卡 */}
      <div style={{
        backgroundColor: '#dc3545',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '40px',
        color: '#fff',
        boxShadow: '0 8px 16px rgba(220, 53, 69, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>👨‍💼 管理员面板</h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>拥有全部管理权限</p>
        </div>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          高级权限
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
              管理 →
            </div>
          </div>
        ))}
      </div>

      {/* 系统统计 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 系统概览</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            borderTop: '3px solid #007bff'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>5</div>
            <div style={{ color: '#666', marginTop: '5px', fontSize: '14px' }}>总新闻数</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            borderTop: '3px solid #28a745'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>5</div>
            <div style={{ color: '#666', marginTop: '5px', fontSize: '14px' }}>注册用户</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            borderTop: '3px solid #dc3545'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>0</div>
            <div style={{ color: '#666', marginTop: '5px', fontSize: '14px' }}>待审核</div>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            borderTop: '3px solid #ffc107'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>12</div>
            <div style={{ color: '#666', marginTop: '5px', fontSize: '14px' }}>今日访问</div>
          </div>
        </div>
      </div>

      {/* 警告信息 */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #ffc107',
        borderRadius: '4px'
      }}>
        <h4 style={{ marginTop: 0, color: '#856404' }}>⚠️ 管理员提示</h4>
        <ul style={{ marginBottom: 0, color: '#856404', lineHeight: '1.8', fontSize: '14px' }}>
          <li>请谨慎操作，所有管理操作都会被记录</li>
          <li>定期查看数据分析报表，了解网站运营状况</li>
          <li>及时审核用户提交的内容，维护社区秩序</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminHub;

