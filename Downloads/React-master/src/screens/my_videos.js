import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './my_video.css';

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [error, setError] = useState('');
  const [editingVideo, setEditingVideo] = useState(null); // State to track the video being edited
  const [editForm, setEditForm] = useState({ title: '', description: '' }); // State for the edit form
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
        const response = await axios.get(`http://localhost:5000/api/users/${userId}/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(response.data);
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

  const incrementVideoViews = async (videoId) => {
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

  const handleVideoClick = async (videoId) => {
    const ownerId = sessionStorage.getItem('userId');
    await incrementVideoViews(videoId);
    navigate(`/video/${videoId}/${ownerId}`);
  };

  const handleEditClick = (video) => {
    setEditingVideo(video._id);
    setEditForm({ title: video.title, description: video.description });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (!userId || !token) {
      setError('User not logged in');
      return;
    }

    const updatedVideo = videos.find(video => video._id === editingVideo);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/videos/${editingVideo}`,
        { ...updatedVideo, title: editForm.title, description: editForm.description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVideos((prev) =>
        prev.map((video) =>
          video._id === editingVideo ? { ...video, ...response.data } : video
        )
      );
      setEditingVideo(null);
    } catch (error) {
      console.error('Error updating video:', error);
      setError('An error occurred while updating the video.');
    }
  };

  const handleDelete = async (videoId) => {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (!userId || !token) {
      setError('User not logged in');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error('Error deleting video:', error);
      setError('An error occurred while deleting the video.');
    }
  };

  return (
    <div className={`video-list-container ${darkTheme ? 'dark' : 'light'}`}>
      <header>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <aside className="left-menu">
        <div className="sidebar-buttons">
          <button onClick={() => navigate('/videolist')}>Home</button>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/add')}>Add Video</button>
          <button onClick={toggleTheme}>
            {darkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </button>
        </div>
      </aside>
      <main>
        {error && <div className="error">{error}</div>}
        <div className="video-list">
          {filteredVideos.map((video) => (
            <div key={video._id} className="video-item">
              <video
                width="320"
                height="240"
                src={video.url}
                muted
                onClick={() => handleVideoClick(video._id)}
              />
              <div className="video-details">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <span>{video.views} views</span>
                <div className="video-actions">
                  <button onClick={() => handleEditClick(video)}>Edit</button>
                  <button onClick={() => handleDelete(video._id)}>Delete</button>
                </div>
              </div>
              {editingVideo === video._id && (
                <form className="edit-form" onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                  ></textarea>
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingVideo(null)}>
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyVideos;
