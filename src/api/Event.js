import axios from "axios";
import { BACKEND } from "../library/constants";
import { store } from "../redux/store";
import { getTeamIdArray } from "../library/helperfunctions";

axios.defaults.baseURL = BACKEND;

const user = store.getState().auth.user;

export const authenticateUser = async (userData) => {
  const res = await axios.post("/login", userData);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await axios.post("/register", userData);
  return res.data;
};

export const getTaskById = async (taskId) => {
  const res = await axios.get("/task" + taskId);
  return res.data;
};

export const getTeamTaskArr = async (teamIds) => {
  const res = await axios.post("/get-team-tasksArr", teamIds);
  return res.data;
}

export const createNewTeam = async (teamData) => {
  const res = await axios.post("/create-team", teamData);
  return res.data;
};

// export const getTeamsByIds = async (teamIds) => {
//   const res = await axios.post("/get-teams", teamIds);
//   return res.data;
// };

export const addConnection = async (id) => {
  const userId = user._id;

  const userData = {
    user: userId,
    id,
  };

  const res = await axios.put("/add-connection", userData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get("/connections");
  return res.data;
};

export const createNewTask = async (taskData) => {
  const res = await axios.post("/create-task", taskData);
  return res.data;
};

export const getAllTasks = async () => {
  const teamIds = getTeamIdArray(user.teams);
  console.log(teamIds)
  const res = await axios.post("/get-all-tasks", teamIds);
  return res.data;
}