import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { BACKEND } from "../../library/constants";
import { QueryCache } from "@tanstack/react-query";


const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  socket: localStorage.getItem('userInfo')
    ? io(BACKEND, {
      auth: {
        user: JSON.parse(localStorage.getItem('userInfo'))
      }
    })
    : null
  ,

  cache: new QueryCache(),
  
  isSidebarOpen: false
}

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isSidebarOpen = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      localStorage.setItem('token', JSON.stringify(action.payload.token))
      state.socket = io(BACKEND, {
        auth: {
          user: action.payload
        }
      });
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.socket.disconnect();
      state.socket = null;
      state.user = null;
      state.isSidebarOpen = false;
      state.cache.clear();
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    },

    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload
    }
  },
})

export const {
  login,
  updateUser,
  logout,
  setOpenSidebar,
} = authSlice.actions

export default authSlice.reducer;