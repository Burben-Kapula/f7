import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './blogSlice'
import notificationReducer from './notificationSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer
  }
})

export default store
