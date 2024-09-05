import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND } from "../../library/constants";

const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  teams: [],
  tasks: [],
  
  isSidebarOpen: false
}

export const updateTeams = createAsyncThunk('teams/getById', async (arg, { getState }) => {
  const teams = getState().auth.user.teams;
  const teamIds = teams.map(team => team.id)

  const res = await axios.post(BACKEND + "/teams", {teamIds: teamIds});

  return res.data;
})

export const updateTasks = createAsyncThunk('tasks/getById', async ({ getState }) => {
  const tasks = getState();
  console.log(tasks)
})

export const updateUser = createAsyncThunk('user/getById', async (id) => {
  const user = await axios.get(BACKEND + "/user" + id);
  return user.data;
})


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
  },

  extraReducers: (builder) => {

    //TODO: add error handling and pending requests
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    }),

    builder.addCase(updateTeams.fulfilled, (state, action) => {
      state.teams = action.payload;
    })
  }
})

export const {
  login,
  logout,
  setOpenSidebar,
} = authSlice.actions

export default authSlice.reducer;