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
            <li><NavLink to="/">🏠 首页</NavLink></li>
            <li><NavLink to="/news">📰 新闻</NavLink></li>
            <li><NavLink to="/shop">🛍️ 商城</NavLink></li>
            <li><NavLink to="/community">🌐 社区</NavLink></li>
            <li><NavLink to="/user-center">👤 个人中心</NavLink></li>
            <li><NavLink to="/admin">🔧 管理后台</NavLink></li>
            <li><NavLink to="/login" style={{ 
              backgroundColor: '#007bff', 
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              marginLeft: '10px'
            }}>登录</NavLink></li>
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