import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './addvideo.css';

const AddVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve userId and token from session storage
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (!userId || !token) {
      setError('User not logged in');
      return;
    }

    const newVideo = {
      title,
      description,
      url,
    };

    try {
      const response = await axios.post(`http://localhost:5000/api/users/${userId}/videos`, newVideo, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Video added:', response.data);
      navigate('/videolist');
    } catch (error) {
      console.error('Error adding video:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while adding the video.');
      }
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Add a New Video</h2>
        <input
          type="text"
          placeholder="Title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Video URL"
          className="input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" className="button">
          Add Video
        </button>
      </form>
    </div>
  );
};

export default AddVideo;
