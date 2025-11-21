import React from 'react';
import NewsList from './NewsList';

function Home() {
  return (
    <div>
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{margin: 0, fontSize: '2.5rem', marginBottom: '1rem'}}>欢迎来到新闻门户</h1>
        <p style={{fontSize: '1.2rem', margin: 0, opacity: 0.9}}>
          及时了解全球资讯，分享您的观点，探索知识的海洋
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="feature-card" style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{color: '#667eea', marginTop: 0}}>📰 热点新闻</h3>
          <p>浏览最新的科技、健康、旅游等各领域资讯，第一时间掌握热门话题。</p>
        </div>
        
        <div className="feature-card" style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{color: '#f093fb', marginTop: 0}}>💬 互动社区</h3>
          <p>在留言板分享您的想法，与其他用户交流互动，建立有价值的讨论。</p>
        </div>
        
        <div className="feature-card" style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{color: '#4facfe', marginTop: 0}}>🔍 智能搜索</h3>
          <p>强大的搜索功能帮助您快速找到感兴趣的内容，精准定位所需信息。</p>
        </div>
        
        <div className="feature-card" style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{color: '#43e97b', marginTop: 0}}>👤 个人中心</h3>
          <p>管理您的个人资料，自定义阅读偏好，打造专属的新闻阅读体验。</p>
        </div>
      </div>

      <NewsList />
    </div>
  );
}

export default Home;
