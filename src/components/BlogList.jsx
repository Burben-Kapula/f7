import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // Для кожного блогу свій input

  // Отримуємо користувача з localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  // Завантажуємо всі блоги
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs`);
      setBlogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Лайк
  const handleLike = async (blogId) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/blogs/${blogId}/like`, {
        userId: user.id
      });
      // Оновлюємо блог в state
      setBlogs(blogs.map(blog => blog.id === blogId ? response.data : blog));
    } catch (err) {
      console.error('Error liking blog:', err);
      alert('Failed to like post');
    }
  };

  // Дізлайк
  const handleDislike = async (blogId) => {
    if (!user) {
      alert('Please login to dislike posts');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/blogs/${blogId}/dislike`, {
        userId: user.id
      });
      setBlogs(blogs.map(blog => blog.id === blogId ? response.data : blog));
    } catch (err) {
      console.error('Error disliking blog:', err);
      alert('Failed to dislike post');
    }
  };

  // Додати коментар
  const handleAddComment = async (blogId) => {
    if (!user) {
      alert('Please login to comment');
      return;
    }

    const commentText = commentInputs[blogId];
    if (!commentText || commentText.trim().length === 0) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/blogs/${blogId}/comments`, {
        userId: user.id,
        text: commentText
      });
      setBlogs(blogs.map(blog => blog.id === blogId ? response.data : blog));
      // Очищаємо input після додавання коментаря
      setCommentInputs({ ...commentInputs, [blogId]: '' });
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    }
  };

  // Видалити коментар
  const handleDeleteComment = async (blogId, commentId) => {
    if (!user) return;

    if (!window.confirm('Delete this comment?')) return;

    try {
      const response = await axios.delete(
        `${API_URL}/blogs/${blogId}/comments/${commentId}`,
        { data: { userId: user.id } }
      );
      setBlogs(blogs.map(blog => blog.id === blogId ? response.data : blog));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  // Видалити блог
  const handleDeleteBlog = async (blogId) => {
    if (!user) return;

    if (!window.confirm('Delete this blog?')) return;

    try {
      await axios.delete(`${API_URL}/blogs/${blogId}`, {
        data: { userId: user.id }
      });
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert(err.response?.data?.error || 'Failed to delete blog');
    }
  };

  // Оновлення input для коментаря
  const handleCommentInputChange = (blogId, value) => {
    setCommentInputs({ ...commentInputs, [blogId]: value });
  };

  // Перевірка чи користувач лайкнув
  const hasUserLiked = (blog) => {
    return user && blog.likes.includes(user.id);
  };

  // Перевірка чи користувач дізлайкнув
  const hasUserDisliked = (blog) => {
    return user && blog.dislikes.includes(user.id);
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="blog-list">
      <h1>📝 All Blogs</h1>
      
      {blogs.length === 0 ? (
        <p className="no-blogs">No blogs yet. Be the first to create one!</p>
      ) : (
        blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            {/* Header блогу */}
            <div className="blog-header">
              <h2>{blog.title}</h2>
              <div className="blog-meta">
                <span>👤 {blog.author?.name || 'Unknown'}</span>
                <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Контент блогу */}
            <div className="blog-content">
              <p>{blog.content}</p>
            </div>

            {/* Лайки і дізлайки */}
            <div className="blog-actions">
              <button 
                onClick={() => handleLike(blog.id)}
                className={`like-btn ${hasUserLiked(blog) ? 'active' : ''}`}
                disabled={!user}
              >
                👍 {blog.likes.length}
              </button>
              
              <button 
                onClick={() => handleDislike(blog.id)}
                className={`dislike-btn ${hasUserDisliked(blog) ? 'active' : ''}`}
                disabled={!user}
              >
                👎 {blog.dislikes.length}
              </button>

              <span className="comments-count">💬 {blog.comments.length} comments</span>

              {/* Кнопка видалення (тільки для автора) */}
              {user && blog.author?.id === user.id && (
                <button 
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="delete-blog-btn"
                >
                  🗑️ Delete
                </button>
              )}
            </div>

            {/* Секція коментарів */}
            <div className="comments-section">
              <h3>Comments:</h3>
              
              {/* Список коментарів */}
              {blog.comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first!</p>
              ) : (
                <div className="comments-list">
                  {blog.comments.map(comment => (
                    <div key={comment._id} className="comment">
                      <div className="comment-header">
                        <strong>{comment.user?.name || 'Unknown'}</strong>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      
                      {/* Кнопка видалення коментаря (тільки для автора коментаря) */}
                      {user && comment.user?._id === user.id && (
                        <button 
                          onClick={() => handleDeleteComment(blog.id, comment._id)}
                          className="delete-comment-btn"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Форма додавання коментаря */}
              {user ? (
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[blog.id] || ''}
                    onChange={(e) => handleCommentInputChange(blog.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(blog.id);
                      }
                    }}
                  />
                  <button onClick={() => handleAddComment(blog.id)}>
                    💬 Add Comment
                  </button>
                </div>
              ) : (
                <p className="login-prompt">Login to comment</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BlogList;
