import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './blogSlice'
import notificationReducer from './notificationSlice'
import userReducer from './userSlice'           // поточний юзер (login)
import usersReducer from '../reducers/usersReducer' // список усіх юзерів (для UserView)

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    user: userReducer,  // стан для login/logout
    users: usersReducer // стан для відображення списку користувачів
  }
})

export default store