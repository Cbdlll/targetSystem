import React from 'react';
import { useNavigate } from 'react-router-dom';

function ShopHub() {
  const navigate = useNavigate();

  const features = [
    {
      title: '产品商城',
      description: '浏览和搜索所有产品，查看产品详情，管理库存',
      icon: '🛒',
      color: '#007bff',
      path: '/products',
      stats: '5+ 产品'
    },
    {
      title: '订单管理',
      description: '查看和管理所有订单，按用户查询，订单排序和筛选',
      icon: '📋',
      color: '#28a745',
      path: '/orders',
      stats: '订单追踪'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#333' }}>
          🛍️ 商城中心
        </h1>
        <p style={{ fontSize: '18px', color: '#666' }}>
          一站式购物和订单管理平台
        </p>
      </div>

      {/* 功能卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px',
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
              border: '2px solid transparent',
              position: 'relative',
              overflow: 'hidden'
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
            {/* 图标 */}
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
              fontSize: '24px', 
              marginBottom: '10px',
              color: '#333'
            }}>
              {feature.title}
            </h3>

            {/* 描述 */}
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {feature.description}
            </p>

            {/* 进入按钮 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              color: feature.color,
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              进入 →
            </div>
          </div>
        ))}
      </div>

      {/* 快速统计 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '30px',
        marginTop: '40px'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>📊 快速统计</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>5</div>
            <div style={{ color: '#666', marginTop: '5px' }}>商品种类</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>4</div>
            <div style={{ color: '#666', marginTop: '5px' }}>待处理订单</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>2</div>
            <div style={{ color: '#666', marginTop: '5px' }}>商品分类</div>
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderLeft: '4px solid #007bff',
        borderRadius: '4px'
      }}>
        <h4 style={{ marginTop: 0, color: '#007bff' }}>💡 使用提示</h4>
        <ul style={{ marginBottom: 0, color: '#666', lineHeight: '1.8' }}>
          <li>在产品商城中可以搜索产品、查看详情和管理库存</li>
          <li>在订单管理中可以按用户查询订单、排序和删除订单</li>
          <li>所有操作都会实时更新数据库</li>
        </ul>
      </div>
    </div>
  );
}

export default ShopHub;

