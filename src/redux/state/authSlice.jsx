import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { BACKEND } from "../../library/constants";

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
  
  isSidebarOpen: false
}

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.socket = io(BACKEND, {
        auth: {
          user: action.payload
        }
      });
      state.isSidebarOpen = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
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
      localStorage.removeItem('userInfo');
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