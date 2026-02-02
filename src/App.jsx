import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Create from './components/Create'
import CreateBlog from './components/CreateBlog'
import BLoglist from './components/BlogList'
import Login from './components/Login'
import Home from './components/Home'

function App() {

  return (
    <>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/login">Login</Link>
        <Link to="/createblog">CreateBlog</Link>
        <Link to="/bloglist">BLoglist</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
        <Route path='/createblog' element={<CreateBlog/>}/>
        <Route path='/bloglist' element={<BLoglist/>}/>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
    </>
  )
}

export default App
