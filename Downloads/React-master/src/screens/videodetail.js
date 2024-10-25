import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './videodetail.css';

const VideoDetail = () => {
  const { videoId, ownerId } = useParams();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, text: 'Great video!' },
    { id: 2, text: 'Thanks for sharing.' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const token = sessionStorage.getItem('token');
      if (!ownerId || !token) {
        setError('User not logged in');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${ownerId}/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideo(response.data);
      } catch (error) {
        console.error('Error fetching video details:', error);
        setError('An error occurred while fetching video details.');
      }
    };

    fetchVideoDetails();
  }, [videoId, ownerId]);

  if (!video) {
    return <div className="loading">{error ? error : 'Loading video details...'}</div>;
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment('');
    }
  };

  const handleEditComment = (id) => {
    const comment = comments.find((comment) => comment.id === id);
    setEditingComment(id);
    setEditText(comment.text);
  };

  const handleSaveEdit = (id) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, text: editText } : comment
    ));
    setEditingComment(null);
    setEditText('');
  };

  const handleDeleteComment = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleShareOptions = () => {
    setShareOptionsVisible(!shareOptionsVisible);
  };

  return (
    <div className="video-detail-container">
      <div className="video-content">
        <video controls>
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-info">
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          <div className="interaction-buttons">
            <button className={`like-button ${liked ? 'liked' : ''}`} onClick={toggleLike}>
              {liked ? 'Liked' : 'Like'}
            </button>
            <button className="share-button" onClick={toggleShareOptions}>Share</button>
            {shareOptionsVisible && (
              <div className="share-options">
                <button onClick={() => alert('Shared on Facebook!')}>Facebook</button>
                <button onClick={() => alert('Shared on Twitter!')}>Twitter</button>
                <button onClick={() => alert('Shared on LinkedIn!')}>LinkedIn</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="add-comment">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
          />
          <button onClick={handleAddComment}>Add</button>
        </div>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              {editingComment === comment.id ? (
                <>
                  <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)} 
                  />
                  <button onClick={() => handleSaveEdit(comment.id)}>Save</button>
                </>
              ) : (
                <>
                  <p>{comment.text}</p>
                  <div className="comment-actions">
                    <button onClick={() => handleEditComment(comment.id)}>Edit</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;