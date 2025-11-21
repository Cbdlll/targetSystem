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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/news', element: <NewsList /> },
      { path: '/news/:id', element: <NewsDetail /> },
      { path: '/search', element: <SearchResults /> },
      { path: '/guestbook', element: <Guestbook /> },
      { path: '/profile', element: <Profile /> },
      { path: '/feedback', element: <Feedback /> },
      { path: '/users', element: <Users /> },
      { path: '/tags', element: <Tags /> },
      { path: '/subscriptions', element: <Subscriptions /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/share', element: <Share /> },
      { path: '/rss', element: <RSS /> },
      { path: '/editor', element: <Editor /> },
      { path: '/analytics', element: <Analytics /> },
      { path: '/recommendations', element: <Recommendations /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)