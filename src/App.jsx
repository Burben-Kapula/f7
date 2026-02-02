import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import Create from './components/Create'
import CreateBlog from './components/CreateBlog'
import BLoglist from './components/BlogList'
import Login from './components/Login'
import Home from './components/Home'

function App() {
  const location = useLocation()  //для location.pathname 
  return (
    <>
    <div>
      <nav>
        {location.pathname !== '/' && (<Link to="/">Bloglist</Link>)}
        {location.pathname !== '/create' && (<Link to="/create">Create</Link>)}
        {location.pathname !== '/login' &&(<Link to="/login">Login</Link>)}
        {location.pathname !== '/createblog' &&(<Link to="/createblog">CreateBlog</Link>)}
        {location.pathname !== '/home' &&(<Link to="/home">Home</Link>)}
      </nav>

      <Routes>
        <Route path="/" element={<BLoglist />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path='/createblog' element={<CreateBlog/>}/>
        <Route path='/home' element={<Home/>}/>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
    </>
  )
}

export default App
