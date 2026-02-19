import { createSlice } from '@reduxjs/toolkit'
import userService from '../service/users' // Сервіс для запитів axios

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = usersSlice.actions

// Асинхронна дія (Thunk) для завантаження даних
export const initializeUsers = () => {
  return async dispatch => {
    try {
      const users = await userService.getAll()
      console.log('USERS FROM API:', users)
      dispatch(setUsers(users))
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }
}


export default usersSlice.reducer