import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './store/blogSlice'
import { setUser, clearUser } from './store/userSlice'
import blogService from './service/api'
import './App.css'
import Create from './components/Create'
import CreateBlog from './components/CreateBlog'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Home from './components/Home'
import Notifications from './components/Notifications'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  
  // Отримуємо користувача з Redux store замість локального стану
  const user = useSelector(state => state.user)

  // Ініціалізація при завантаженні додатку
  useEffect(() => {
    // Завантажуємо блоги з сервера
    dispatch(initializeBlogs())
    
    // Перевіряємо чи є збережений користувач в localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'null') {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Зберігаємо користувача в Redux
        dispatch(setUser(parsedUser))
        // Встановлюємо токен для API запитів
        blogService.setToken(parsedUser.token)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [dispatch])

  // Функція logout
  const handleLogout = () => {
    // Видаляємо з localStorage
    localStorage.removeItem('user')
    // Очищаємо Redux state
    dispatch(clearUser())
    // Очищаємо токен з API сервісу
    blogService.setToken(null)
  }

  return (
    <>
      <div>
        <nav style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Головна - завжди показується (якщо не на головній) */}
          {location.pathname !== '/' && (
            <Link to="/" style={{ textDecoration: 'none' }}>
              📝 Bloglist
            </Link>
          )}

          {/* Якщо НЕ залогінений - показуємо Login і Register */}
          {!user && (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  🔐 Login
                </Link>
              )}
              {location.pathname !== '/create' && (
                <Link to="/create" style={{ textDecoration: 'none' }}>
                  📋 Register
                </Link>
              )}
            </>
          )}

          {/* Якщо ЗАЛОГІНЕНИЙ - показуємо всі кнопки */}
          {user && (
            <>
              {location.pathname !== '/createblog' && (
                <Link to="/createblog" style={{ textDecoration: 'none' }}>
                  ➕ Create Blog
                </Link>
              )}
              {location.pathname !== '/home' && (
                <Link to="/home" style={{ textDecoration: 'none' }}>
                  👤 Profile
                </Link>
              )}
              <button 
                onClick={handleLogout}
                style={{
                  marginLeft: 'auto',
                  padding: '8px 15px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🚪 Logout ({user.name})
              </button>
            </>
          )}
        </nav>

        {/* Компонент для показу повідомлень */}
        <Notifications />

        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </>
  )
}

export default App
