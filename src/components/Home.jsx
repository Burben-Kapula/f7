import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { initializeBlogs, deleteBlog,  } from '../store/blogSlice'
import { showNotification } from '../store/notificationSlice'

const Home = () => {
  const dispatch = useDispatch()
  
  // Отримуємо блоги та користувача з Redux
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  useEffect(() => {
    // Завантажуємо блоги при монтуванні компонента
    dispatch(initializeBlogs())
  }, [dispatch])

  // Функція для видалення блога
  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author?.name}?`)) {
      try {
        await dispatch(deleteBlog(blog.id))
        dispatch(showNotification(`Blog "${blog.title}" deleted successfully`, 'success', 5))
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to delete blog'
        dispatch(showNotification(errorMessage, 'error', 5))
      }
    }
  }

  // Функція для лайку блога
  // const handleLike = async (blog) => {
  //   try {
  //     await dispatch(likeBlog(blog))
  //     dispatch(showNotification(`You liked "${blog.title}"`, 'success', 3))
  //   } catch (error) {
  //     console.error('Failed to like blog:', error)
  //     const errorMessage = 
  //       error.response?.data?.error ||
  //       error.message ||
  //       'Network error. Please check your connection.'
  //     dispatch(showNotification(errorMessage, 'error', 5))
  //   }
  // }

  // Перевірка власника з debugging
const isOwner = (blog) => {
  // Якщо користувача немає (не залогінений) – точно не власник
  if (!user) {
    console.log('❌ No user:', { user })
    return false
  }
  
  // Змінна, куди будемо записувати id автора блогу
  let authorId = null
  
  // Випадок 1: blog.author — це просто рядок з id
  if (typeof blog.author === 'string') {
    authorId = blog.author
  // Випадок 2: blog.author — об'єкт з полем id
  } else if (blog.author && blog.author.id) {
    authorId = blog.author.id
  // Випадок 3: fallback — якщо є окреме поле userId
  } else if (blog.userId) {
    authorId = blog.userId
  }
  
  // Порівнюємо id автора з id поточного користувача
  const result = authorId === user.id

  // Лог у консоль для налагодження: що саме порівнюємо
  console.log('🔍 Ownership check:', {
    blogTitle: blog.title,     // заголовок блогу
    authorId: authorId,        // обраний id автора
    blogAuthor: blog.author,   // сире поле author з блогу
    userId: blog.userId,       // поле userId, якщо є
    currentUserId: user.id,    // id поточного залогіненого юзера
    isOwner: result            // результат перевірки (true / false)
  })

  // Повертаємо true, якщо поточний юзер — власник блогу
  return result
}


  // Фільтруємо блоги - показуємо тільки власні
  const myBlogs = blogs.filter(blog => isOwner(blog))

  // Debugging після фільтрації
  console.log('📊 Total blogs:', blogs.length)
  console.log('📊 My blogs:', myBlogs.length)
  console.log('👤 Current user:', user)

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#1a1a1a',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#ffffff' }}>My Profile</h1>
      
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ color: 'white', margin: '0 0 10px 0' }}>
            Welcome, {user.name}! 👋
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '5px 0', fontSize: '12px' }}>
            <strong>User ID:</strong> {user.id}
          </p>
        </div>
      )}

      {/* Debug панель - видали після тестування */}
      <details style={{
        backgroundColor: '#2a2a2a',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        color: '#cccccc'
      }}>
        <summary style={{ cursor: 'pointer', color: '#ffffff', fontWeight: 'bold' }}>
          🔍 Debug Info (click to expand)
        </summary>
        <div style={{ marginTop: '10px', fontSize: '14px' }}>
          <p><strong>Total blogs:</strong> {blogs.length}</p>
          <p><strong>My blogs:</strong> {myBlogs.length}</p>
          <p><strong>Current user ID:</strong> {user?.id || 'Not logged in'}</p>
          <hr style={{ borderColor: '#3a3a3a', margin: '10px 0' }} />
          <p><strong>All blogs:</strong></p>
          {blogs.map(blog => (
            <div key={blog.id} style={{ 
              padding: '8px', 
              marginBottom: '8px', 
              backgroundColor: '#1a1a1a',
              borderRadius: '4px'
            }}>
              <strong>{blog.title}</strong><br/>
              Author: {typeof blog.author === 'string' ? blog.author : (blog.author?.id || 'No author')}<br/>
              User ID: {blog.userId || 'No userId'}<br/>
              Is mine: {isOwner(blog) ? '✅ YES' : '❌ NO'}
            </div>
          ))}
        </div>
      </details>

      <h2 style={{ color: '#ffffff' }}>My Blogs ({myBlogs.length})</h2>
      
      {myBlogs.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          border: '2px solid #3a3a3a'
        }}>
          <p style={{ fontSize: '18px', color: '#cccccc' }}>
            You haven't created any blogs yet. ✍️
          </p>
          <p style={{ color: '#999999' }}>Create your first blog to get started!</p>
        </div>
      ) : (
        <div>
          {myBlogs.map(blog => (
            <div 
              key={blog.id} 
              style={{
                border: '2px solid #3a3a3a',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#2a2a2a',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <h3 style={{ marginTop: 0, color: '#ffffff', fontSize: '22px' }}>
                {blog.title}
              </h3>
              
              <p style={{ color: '#aaaaaa', fontSize: '14px', marginBottom: '10px' }}>
                by <strong style={{ color: '#ffffff' }}>{blog.author?.name || 'Unknown'}</strong>
              </p>
              
              <p style={{ color: '#cccccc', marginBottom: '15px' }}>
                {blog.content}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '15px',
                flexWrap: 'wrap'
              }}>
              <p>
                👍 {Array.isArray(blog.likes) ? blog.likes.length : blog.likes || 0} likes
              </p>


                <button
                  onClick={() => handleDelete(blog)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(245, 87, 108, 0.3)'
                  }}
                >
                  🗑️ Delete
                </button>

                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}>
                  ✨ My Blog
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
