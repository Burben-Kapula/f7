import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Create from './components/Create'
import CreateBlog from './components/CreateBlog'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Home from './components/Home'


function App() {
  const location = useLocation()
  const [user, setUser] = useState(() => {
    // Ініціалізуємо state одразу при створенні компонента
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'null') {
      try {
        return JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        return null
      }
    }
    return null
  })

  // Видаляємо useEffect з setUser - він не потрібен!
  // State вже ініціалізований вище

  // Функція logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <>
      <div>
        <nav>
          {/* Головна - завжди показується (якщо не на головній) */}
          {location.pathname !== '/' && (
            <Link to="/">📝 Bloglist</Link>
          )}

          {/* Якщо НЕ залогінений - показуємо Login і Register */}
          {!user && (
            <>
              {location.pathname !== '/login' && (
                <Link to="/login">🔐 Login</Link>
              )}
              {location.pathname !== '/create' && (
                <Link to="/create">📋 Register</Link>
              )}
            </>
          )}

          {/* Якщо ЗАЛОГІНЕНИЙ - показуємо всі кнопки */}
          {user && (
            <>
              {location.pathname !== '/createblog' && (
                <Link to="/createblog">➕ Create Blog</Link>
              )}
              {location.pathname !== '/home' && (
                <Link to="/home">👤 Profile</Link>
              )}
              <button onClick={handleLogout}>
                🚪 Logout ({user.name})
              </button>
            </>
          )}
        </nav>

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
