import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Profile() {
  const location = useLocation();

  // DOM XSS 1: innerHTML from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const username = params.get('username');

    const welcomeElement = document.getElementById('welcome-message');
    if (welcomeElement) {
      if (username) {
        welcomeElement.innerHTML = `欢迎回来, ${username}!`;
      }
    }
  }, [location.search]);

  // DOM XSS 2: location.href from URL hash (保留在Profile页面)
  useEffect(() => {
    if (location.hash.startsWith('#redirectUrl=')) {
      const redirectUrl = location.hash.substring(12); // Get value after #redirectUrl=
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    }
  }, [location.hash]);

  // DOM XSS 3: document.write from URL parameter (保留在Profile页面)
  const printNote = () => {
    const params = new URLSearchParams(location.search);
    const note = params.get('note');
    if (note) {
      // This will overwrite the entire page content
      document.write(note);
    }
  };

  return (
    <div>
      <h2>个人资料</h2>
      <p>这是一个模拟的用户资料页面。页面内容可以通过URL参数动态生成。</p>
      
      <div className="card" style={{marginTop: '2rem', padding: '2rem'}}>
        <h3 id="welcome-message">欢迎回来, 访客!</h3>
        <p>你的个人信息会在这里展示。</p>
      </div>

      <div className="card" style={{marginTop: '2rem', padding: '2rem'}}>
        <h4>页面功能</h4>
        <button className="btn btn-info" onClick={printNote} style={{marginRight: '10px'}}>打印便签</button>
        <small className="d-block mt-2">提示：此功能会使用URL参数动态加载内容。</small>
      </div>
    </div>
  );
}

export default Profile;
