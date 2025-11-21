import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <NavLink to="/" className="logo-link"><h1 className="logo">新闻门户</h1></NavLink>
          <ul className="nav-links">
            <li><NavLink to="/">首页</NavLink></li>
            <li><NavLink to="/news">新闻</NavLink></li>
            <li><NavLink to="/guestbook">留言板</NavLink></li>
            <li><NavLink to="/users">用户</NavLink></li>
            <li><NavLink to="/profile">个人中心</NavLink></li>
            <li><NavLink to="/feedback">反馈</NavLink></li>
            <li><NavLink to="/tags">标签</NavLink></li>
            <li><NavLink to="/subscriptions">订阅</NavLink></li>
            <li><NavLink to="/favorites">收藏</NavLink></li>
            <li><NavLink to="/share">分享</NavLink></li>
            <li><NavLink to="/rss">RSS</NavLink></li>
            <li><NavLink to="/recommendations">推荐</NavLink></li>
            <li><NavLink to="/editor">编辑后台</NavLink></li>
            <li><NavLink to="/analytics">数据分析</NavLink></li>
          </ul>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="搜索新闻..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">搜索</button>
          </form>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2025 新闻门户. 保留所有权利。</p>
      </footer>
    </>
  );
}

export default App;