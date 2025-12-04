import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Home from './pages/Home.jsx';
import NewsList from './pages/NewsList.jsx';
import NewsDetail from './pages/NewsDetail.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Guestbook from './pages/Guestbook.jsx';
import Profile from './pages/Profile.jsx';
import Feedback from './pages/Feedback.jsx';
import Users from './pages/Users.jsx';
import Tags from './pages/Tags.jsx';
import Subscriptions from './pages/Subscriptions.jsx';
import Favorites from './pages/Favorites.jsx';
import Share from './pages/Share.jsx';
import RSS from './pages/RSS.jsx';
import Editor from './pages/Editor.jsx';
import Analytics from './pages/Analytics.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import ShopHub from './pages/ShopHub.jsx';
import CommunityHub from './pages/CommunityHub.jsx';
import UserCenter from './pages/UserCenter.jsx';
import AdminHub from './pages/AdminHub.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/news', element: <NewsList /> },
      { path: '/news/:id', element: <NewsDetail /> },
      { path: '/search', element: <SearchResults /> },
      
      // 商城中心
      { path: '/shop', element: <ShopHub /> },
      { path: '/products', element: <Products /> },
      { path: '/orders', element: <Orders /> },
      
      // 社区互动
      { path: '/community', element: <CommunityHub /> },
      { path: '/guestbook', element: <Guestbook /> },
      { path: '/rss', element: <RSS /> },
      { path: '/share', element: <Share /> },
      { path: '/feedback', element: <Feedback /> },
      
      // 个人中心
      { path: '/user-center', element: <UserCenter /> },
      { path: '/profile', element: <Profile /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/subscriptions', element: <Subscriptions /> },
      { path: '/recommendations', element: <Recommendations /> },
      
      // 管理后台
      { path: '/admin', element: <AdminHub /> },
      { path: '/editor', element: <Editor /> },
      { path: '/analytics', element: <Analytics /> },
      { path: '/users', element: <Users /> },
      { path: '/tags', element: <Tags /> },
      
      // 登录
      { path: '/login', element: <Login /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)