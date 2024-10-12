import { createSlice } from "@reduxjs/toolkit";
import { QueryCache } from "@tanstack/react-query";


const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cache: new QueryCache(),
  
  isSidebarOpen: false
}

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isSidebarOpen = true;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      state.cache.clear();
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