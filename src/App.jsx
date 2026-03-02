import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './store/blogSlice'
import { setUser, clearUser } from './store/userSlice'
import blogService from './service/api'
import './components/styles/App.css'
import Create from './components/Create'
import CreateBlog from './components/CreateBlog'
import BlogList from './components/BlogList'
import Login from './components/Login'
import Home from './components/Home'
import Notifications from './components/Notifications'
import UserView from './components/UsersView'
import { initializeUsers } from './reducers/usersReducer'
import BlogView from './components/BlogView'

import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Paper
} from '@mui/material'

function App() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())

    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'null') {
      try {
        const parsedUser = JSON.parse(storedUser)
        dispatch(setUser(parsedUser))
        blogService.setToken(parsedUser.token)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [dispatch])

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch(clearUser())
    blogService.setToken(null)
  }

  const isActive = (path) => location.pathname === path

  return (
    <Container sx={{ mt: 2, mb: 4 }}>
      <AppBar position="static" color="default" sx={{ mb: 2, borderRadius: 1 }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/"
            color={isActive('/') ? 'primary' : 'inherit'}
            sx={{ textTransform: 'none', fontWeight: isActive('/') ? 700 : 400 }}
          >
            📝 Bloglist
          </Button>

          {!user && (
            <>
              {location.pathname !== '/login' && (
                <Button
                  component={Link}
                  to="/login"
                  color={isActive('/login') ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'none' }}
                >
                  🔐 Login
                </Button>
              )}
              {location.pathname !== '/create' && (
                <Button
                  component={Link}
                  to="/create"
                  color={isActive('/create') ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'none' }}
                >
                  📋 Register
                </Button>
              )}
            </>
          )}

          {user && (
            <>
              {location.pathname !== '/createblog' && (
                <Button
                  component={Link}
                  to="/createblog"
                  color={isActive('/createblog') ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'none' }}
                >
                  ➕ Create Blog
                </Button>
              )}
              {location.pathname !== '/home' && (
                <Button
                  component={Link}
                  to="/home"
                  color={isActive('/home') ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'none' }}
                >
                  👤 Profile
                </Button>
              )}
              {location.pathname !== '/users' && (
                <Button
                  component={Link}
                  to="/users"
                  color={isActive('/users') ? 'primary' : 'inherit'}
                  sx={{ textTransform: 'none' }}
                >
                  👥 Users
                </Button>
              )}

              <Typography sx={{ ml: 'auto', mr: 1 }}>
                {user.name}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{ textTransform: 'none' }}
              >
                🚪 Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Notifications />

      <Paper sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<UserView />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Paper>
    </Container>
  )
}

export default App
