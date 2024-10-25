import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './videolist.css';

const defaultAvatarUrl = 'https://via.placeholder.com/150'; // Replace with the URL of your default avatar

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const userId = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('token');
      if (!userId || !token) {
        setError('User not logged in');
        return;
      }

      try {
        const [videosResponse, recommendationsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/videos2', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/recommendations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setVideos(videosResponse.data);
        setRecommendedVideos(recommendationsResponse.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('An error occurred while fetching videos.');
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleTheme = () => {
    setDarkTheme((prevTheme) => !prevTheme);
  };

  const incrementVideoViews = async (videoId, ownerId) => {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (!userId || !token) {
      setError('User not logged in');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/videos/${videoId}/increment-views`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error incrementing video views:', error);
      setError('An error occurred while incrementing video views.');
    }
  };

  const handleVideoClick = async (videoId, ownerId) => {
    await incrementVideoViews(videoId, ownerId);
    navigate(`/video/${videoId}/${ownerId}`);
  };

  const renderVideoItem = (video, isRecommended = false) => (
    <div key={video._id} className={`video-item ${isRecommended ? 'recommended' : ''}`} onClick={() => handleVideoClick(video._id, video.owner._id)}>
      <div className="video-thumbnail">
        <video src={video.url} muted />
      </div>
      <div className="video-details">
        <h3>{video.title}</h3>
        <p>{video.description}</p>
        <span>{video.views} views</span>
        <div className="owner-details">
          <img 
            className="avatar" 
            src={video.owner.picture || defaultAvatarUrl} 
            alt={video.owner.name || "Default Avatar"}
          />
          <p>{video.owner.name || "Unknown User"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`video-list-container ${darkTheme ? 'dark' : 'light'}`}>
      <header className="header">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {darkTheme ? 'Light Theme' : 'Dark Theme'}
        </button>
      </header>
      <aside className="left-menu">
        <div className="sidebar-buttons">
          <button onClick={() => navigate('/videolist')}>Home</button>
          <button onClick={() => navigate('/myvideos')}>My Videos</button>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/add')}>Add Video</button>
        </div>
      </aside>
      <main className="main-content">
        {error && <div className="error">{error}</div>}
        {recommendedVideos.length > 0 && (
          <div className="recommended-videos-section">
            <h2>Recommended Videos</h2>
            <div className="recommended-videos-list">
              {recommendedVideos.map(video => renderVideoItem(video, true))}
            </div>
          </div>
        )}
        <div className="all-videos-section">
          <h2>All Videos</h2>
          <div className="video-list">
            {filteredVideos.map(video => renderVideoItem(video))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoList;
