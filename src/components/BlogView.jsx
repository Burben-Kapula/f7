import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // беремо блог із Redux
  const blogFromStore = useSelector(state =>
    state.blogs.find(b => b.id === id)
  )

  // локальний стейт для блогу (щоб оновлювати після лайків/коментів)
  const [blog, setBlog] = useState(blogFromStore || null)
  const [user, setUser] = useState(null)
  const [commentInput, setCommentInput] = useState('')
  const [loading, setLoading] = useState(!blogFromStore)
  const [error, setError] = useState(null)

  // дістаємо користувача з localStorage (як у BlogList)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error('Error parsing user:', err)
      }
    }
  }, [])

  // якщо блогу нема в Redux (після refresh), підтягуємо його з бекенда
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/blogs/${id}`)
        setBlog(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError('Failed to load blog')
      } finally {
        setLoading(false)
      }
    }

    if (!blogFromStore) {
      fetchBlog()
    }
  }, [id, blogFromStore])

  if (loading) {
    return <div className="loading">Loading blog...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!blog) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '50px auto',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Blog not found</h2>
        <p style={{ color: '#666' }}>
          The blog you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    )
  }

  // перевірка лайків/дизлайків (та сама, що в BlogList)
  const hasUserLiked = () =>
    user && blog.likes.includes(user.id)

  const hasUserDisliked = () =>
    user && blog.dislikes.includes(user.id)

  // Лайк
  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts')
      return
    }

    try {
      const response = await axios.put(`${API_URL}/blogs/${blog.id}/like`, {
        userId: user.id,
      })
      setBlog(response.data)
    } catch (err) {
      console.error('Error liking blog:', err)
      alert('Failed to like post')
    }
  }

  // Дізлайк
  const handleDislike = async () => {
    if (!user) {
      alert('Please login to dislike posts')
      return
    }

    try {
      const response = await axios.put(`${API_URL}/blogs/${blog.id}/dislike`, {
        userId: user.id,
      })
      setBlog(response.data)
    } catch (err) {
      console.error('Error disliking blog:', err)
      alert('Failed to dislike post')
    }
  }

  // Додати коментар
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to comment')
      return
    }

    if (!commentInput.trim()) {
      alert('Comment cannot be empty')
      return
    }

    try {
      const response = await axios.post(`${API_URL}/blogs/${blog.id}/comments`, {
        userId: user.id,
        text: commentInput.trim(),
      })
      setBlog(response.data) // бекенд повертає оновлений блог з comments
      setCommentInput('')
    } catch (err) {
      console.error('Error adding comment:', err)
      alert('Failed to add comment')
    }
  }

  // Видалити коментар
  const handleDeleteComment = async (commentId) => {
    if (!user) return
    if (!window.confirm('Delete this comment?')) return

    try {
      const response = await axios.delete(
        `${API_URL}/blogs/${blog.id}/comments/${commentId}`,
        { data: { userId: user.id } }
      )
      setBlog(response.data)
    } catch (err) {
      console.error('Error deleting comment:', err)
      alert(err.response?.data?.error || 'Failed to delete comment')
    }
  }

  // Видалити блог
  const handleDeleteBlog = async () => {
    if (!user) return
    if (!window.confirm(`Delete blog "${blog.title}"?`)) return

    try {
      await axios.delete(`${API_URL}/blogs/${blog.id}`, {
        data: { userId: user.id },
      })
      navigate('/') // назад до списку
    } catch (err) {
      console.error('Error deleting blog:', err)
      alert(err.response?.data?.error || 'Failed to delete blog')
    }
  }

  const canDelete =
    user &&
    (blog.author?.id === user.id || blog.author?._id === user.id)

  return (
    <div className="blog-view">
      <h1>{blog.title}</h1>
      <p>👤 {blog.author?.name || 'Unknown'}</p>
      <p>🔗 <a href={blog.url}>{blog.url}</a></p>

      <div className="blog-actions">
        <button
          onClick={handleLike}
          className={`like-btn ${hasUserLiked() ? 'active' : ''}`}
          disabled={!user}
        >
          👍 {blog.likes.length}
        </button>

        <button
          onClick={handleDislike}
          className={`dislike-btn ${hasUserDisliked() ? 'active' : ''}`}
          disabled={!user}
        >
          👎 {blog.dislikes.length}
        </button>

        {canDelete && (
          <button
            onClick={handleDeleteBlog}
            className="delete-blog-btn"
          >
            🗑️ Delete blog
          </button>
        )}
      </div>

      <div className="blog-content">
        <p>{blog.content}</p>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>

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

                {user &&
                  (comment.user?._id === user.id ||
                    comment.user?.id === user.id) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="delete-comment-btn"
                    >
                      🗑️
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form className="add-comment" onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
            />
            <button type="submit">💬 Add Comment</button>
          </form>
        ) : (
          <p className="login-prompt">Login to comment</p>
        )}
      </div>
    </div>
  )
}

export default BlogView
