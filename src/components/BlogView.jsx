import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog } from '../store/blogSlice'
import { showNotification } from '../store/notificationSlice'
import blogService from '../service/api'

const BlogView = () => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const id = useParams().id
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const blog = useSelector(state => 
    state.blogs.find(b => b.id === id)
  )
  const user = useSelector(state => state.user)

  useEffect(() => {
    if (blog) {
      blogService.getComments(blog.id).then(comments => {
        setComments(comments)
      }).catch(error => {
        console.error('Failed to fetch comments:', error)
      })
    }
  }, [blog])

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

  const handleLike = () => {
    dispatch(likeBlog(blog))
    dispatch(showNotification(`You liked '${blog.title}'`, 'success', 5))
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await dispatch(deleteBlog(blog.id))
        dispatch(showNotification(`Blog '${blog.title}' removed`, 'success', 5))
        navigate('/')
      } catch (err) {
        console.error('Failed to add comment:', err)
        dispatch(showNotification('Failed to add comment', 'error', 5))
        }

    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!newComment.trim()) {
      dispatch(showNotification('Comment cannot be empty', 'error', 5))
      return
    }

    try {
      const returnedComment = await blogService.addComment(blog.id, newComment)
      setComments(comments.concat(returnedComment))
      setNewComment('')
      dispatch(showNotification('Comment added', 'success', 5))
    } catch (err) {
    console.error('Failed to add comment:', err)
    dispatch(showNotification('Failed to add comment', 'error', 5))
    }

  }

  const canDelete = user && blog.user && user.username === blog.user.username

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2196F3',
        color: 'white',
        padding: '30px',
        borderRadius: '12px 12px 0 0',
        marginBottom: '0'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
          {blog.title}
        </h1>
        <p style={{ margin: '0', opacity: 0.9, fontSize: '16px' }}>
          by {blog.author || 'Unknown'}
        </p>
      </div>

      {/* Content Card */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        {/* URL */}
        <div style={{ marginBottom: '20px' }}>
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#2196F3', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            🔗 {blog.url}
          </a>
        </div>

        {/* Likes */}
        <div style={{ 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{ 
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            👍 {blog.likes || 0} likes
          </span>
          
          <button 
            onClick={handleLike}
            disabled={!user}
            style={{
              padding: '10px 20px',
              backgroundColor: user ? '#4CAF50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: user ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => {
              if (user) e.target.style.backgroundColor = '#45a049'
            }}
            onMouseLeave={(e) => {
              if (user) e.target.style.backgroundColor = '#4CAF50'
            }}
          >
            {user ? 'Like' : 'Login to like'}
          </button>
        </div>

        {/* Delete button */}
        {canDelete && (
          <button 
            onClick={handleDelete}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#da190b'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            🗑️ Remove blog
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div style={{
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          marginTop: '0',
          marginBottom: '20px',
          fontSize: '24px',
          color: '#333'
        }}>
          💬 Comments
        </h2>
        
        {/* Add comment form */}
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196F3'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <button 
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1976d2'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2196F3'}
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <p style={{ 
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            color: '#666',
            marginBottom: '30px'
          }}>
            Please login to add comments
          </p>
        )}

        {/* Comments list */}
        {comments.length === 0 ? (
          <p style={{ 
            textAlign: 'center',
            color: '#999',
            fontSize: '16px',
            padding: '40px 0'
          }}>
            No comments yet. Be the first to comment! 💭
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {comments.map((comment, index) => (
              <li 
                key={index}
                style={{
                  padding: '15px',
                  marginBottom: '12px',
                  backgroundColor: '#f9f9f9',
                  borderLeft: '4px solid #2196F3',
                  borderRadius: '4px',
                  fontSize: '16px',
                  color: '#333',
                  lineHeight: '1.5'
                }}
              >
                {comment.comment || comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default BlogView
