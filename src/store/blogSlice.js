import { createSlice } from '@reduxjs/toolkit'
import blogService from '../service/api.js'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    appendBlog(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.likes - a.likes)
    },
    updateBlog(state, action) {
      const id = action.payload.id
      const updated = state.map(blog => 
        blog.id === id ? action.payload : blog
      )
      return updated.sort((a, b) => b.likes - a.likes)
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

// Thunks для асинхронних операцій
export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (error) {
      console.error('Failed to fetch blogs:', error)
    }
  }
}

export const createBlog = (blogObject) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.create(blogObject)
      dispatch(appendBlog(newBlog))
      return newBlog
    } catch (error) {
      console.error('Failed to create blog:', error)
      throw error
    }
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    try {
      const updated = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1
      })
      dispatch(updateBlog(updated))
    } catch (error) {
      console.error('Failed to update blog:', error)
    }
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    try {
      await blogService.remove(id)
      dispatch(removeBlog(id))
    } catch (error) {
      console.error('Failed to delete blog:', error)
      throw error
    }
  }
}

export default blogSlice.reducer
