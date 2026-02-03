import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]);
  const [topBlog, setTopBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('likes'); // 'likes' або 'comments'

  // Отримуємо користувача з localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }
  }, []);

  // Завантажуємо блоги коли є user
  useEffect(() => {
    if (user) {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [user, sortBy]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/blogs`);
      const allBlogs = response.data;

      // Фільтруємо свої блоги
      const userBlogs = allBlogs.filter(blog => blog.author?.id === user.id);
      setMyBlogs(userBlogs);

      // Знаходимо топ блог
      if (allBlogs.length > 0) {
        let blogsWithMax = [];

        if (sortBy === 'likes') {
          const maxLikes = Math.max(...allBlogs.map(b => b.likes.length));
          blogsWithMax = allBlogs.filter(b => b.likes.length === maxLikes);
        } else {
          const maxComments = Math.max(...allBlogs.map(b => b.comments.length));
          blogsWithMax = allBlogs.filter(b => b.comments.length === maxComments);
        }

        // Випадковий вибір якщо кілька
        const randomIndex = Math.floor(Math.random() * blogsWithMax.length);
        setTopBlog(blogsWithMax[randomIndex]);
      } else {
        setTopBlog(null);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Видалити блог
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Delete this blog?')) return;

    try {
      await axios.delete(`${API_URL}/blogs/${blogId}`, {
        data: { userId: user.id }
      });
      
      // Видаляємо з списку
      setMyBlogs(myBlogs.filter(blog => blog.id !== blogId));
      
      // Оновлюємо топ блог якщо видалили його
      if (topBlog?.id === blogId) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert(err.response?.data?.error || 'Failed to delete blog');
    }
  };

  // Якщо не залогінений
  if (!user) {
    return (
      <div className="home-container">
        <h1>👋 Welcome to Bloglist</h1>
        <p>Please login to see your profile</p>
      </div>
    );
  }

  // Завантаження
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Помилка
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      <h1>👤 Profile: {user.name}</h1>
      <p className="user-email">📧 {user.email}</p>

      {/* Фільтр для топ блогу */}
      <div className="filter-section">
        <h2>🏆 Top Blog</h2>
        <div className="filter-buttons">
          <button
            className={sortBy === 'likes' ? 'active' : ''}
            onClick={() => setSortBy('likes')}
          >
            👍 By Likes
          </button>
          <button
            className={sortBy === 'comments' ? 'active' : ''}
            onClick={() => setSortBy('comments')}
          >
            💬 By Comments
          </button>
        </div>
      </div>

      {/* Топ блог */}
      {topBlog ? (
        <div className="top-blog-card">
          <div className="top-badge">
            {sortBy === 'likes' ? '🏆 Most Liked' : '🏆 Most Commented'}
          </div>
          <h3>{topBlog.title}</h3>
          <p className="blog-author">👤 {topBlog.author?.name || 'Unknown'}</p>
          <p className="blog-content">
            {topBlog.content.length > 150 
              ? topBlog.content.substring(0, 150) + '...' 
              : topBlog.content}
          </p>
          <div className="blog-stats">
            <span>👍 {topBlog.likes.length} likes</span>
            <span>💬 {topBlog.comments.length} comments</span>
          </div>
          <button onClick={() => navigate('/')} className="view-btn-top">
            📖 View Full Blog
          </button>
        </div>
      ) : (
        <div className="no-top-blog">
          <p>No blogs available yet</p>
        </div>
      )}

      {/* Мої блоги */}
      <div className="my-blogs-section">
        <h2>📝 My Blogs ({myBlogs.length})</h2>
        
        {myBlogs.length === 0 ? (
          <div className="no-blogs">
            <p>You haven't created any blogs yet.</p>
            <button onClick={() => navigate('/createblog')} className="create-btn">
              ➕ Create Your First Blog
            </button>
          </div>
        ) : (
          <div className="blogs-grid">
            {myBlogs.map(blog => (
              <div key={blog.id} className="blog-card">
                <h3>{blog.title}</h3>
                <p className="blog-preview">
                  {blog.content.length > 100 
                    ? blog.content.substring(0, 100) + '...' 
                    : blog.content}
                </p>
                <div className="blog-stats">
                  <span>👍 {blog.likes.length}</span>
                  <span>💬 {blog.comments.length}</span>
                </div>
                <div className="blog-date">
                  📅 {new Date(blog.createdAt).toLocaleDateString('fi-FI')}
                </div>
                <div className="blog-actions">
                  <button onClick={() => navigate('/')} className="view-btn">
                    👁️ View
                  </button>
                  <button 
                    onClick={() => handleDeleteBlog(blog.id)} 
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
