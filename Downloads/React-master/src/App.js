import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import AddVideo from './screens/addvideo';
import MyVideos from './screens/my_videos';
import VideoDetail from './screens/videodetail';
import React, { useState } from 'react';
import Login from './screens/login';
import Register from './screens/register';
import VideoList from './screens/VideoList';
import './App.css';

const App = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <Router>
      <div className={`App ${darkTheme ? 'dark' : 'light'}`}>
        <ConditionalNav toggleTheme={toggleTheme} darkTheme={darkTheme} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/videolist" element={<VideoList />} />
          <Route path="/myvideos" element={<MyVideos />} />
          <Route path="/add" element={<AddVideo />} />
          <Route path="/video/:videoId/:ownerId" element={<VideoDetail />} />

          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

const ConditionalNav = ({ toggleTheme, darkTheme }) => {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  if (hideNav) {
    return null;
  }

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add">Add Video</Link>
      <button onClick={toggleTheme}>
        {darkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      </button>
    </nav>
  );
};

export default App;
