import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  
  isSidebarOpen: false
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isSidebarOpen = true; //TODO
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isSidebarOpen = false; //TODO
      localStorage.removeItem('userInfo');
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload
    }
  }
})

export const { login, logout, setOpenSidebar } = authSlice.actions

export default authSlice.reducer;