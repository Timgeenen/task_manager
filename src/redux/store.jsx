import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/state/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
})