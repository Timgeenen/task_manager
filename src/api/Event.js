import axios from "axios";
import { BACKEND } from "../library/constants";
import { getAuthHeader, getTeamIdArray } from "../library/helperfunctions";
import { store } from "../redux/store";

axios.defaults.baseURL = BACKEND;

const user = store.getState().auth.user;

//user api calls
export const authenticateUser = async (userData) => {
  const res = await axios.put("/login", userData);
  return res.data;
};

export const createUser = async (userData) => {
  const res = await axios.post("/register", userData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get("/connections");
  return res.data;
};

export const getConnections = async (idArray) => {
  const auth = getAuthHeader();
  const res = await axios.post("/get-connected", idArray, auth);
  return res.data;
};

export const addConnection = async (id) => {

  const auth = getAuthHeader();

  const res = await axios.put("/add-connection", { id }, auth);
  return res.data;
};

export const getAllNotifications = async (unreadOnly) => {
  let route = `/notifications${user._id}`;
  if (unreadOnly) {
    route += "?unread=true";
  };

  const auth = getAuthHeader();
  const res = await axios.get(route, auth);
  
  return res.data;
};

export const getUserById = async (userId) => {
  const auth = getAuthHeader();
  const res = await axios.get(`/user${userId}`, auth);
  return res.data;
};

//task api calls
export const getTaskById = async (taskId) => {
  const auth = getAuthHeader();
  const res = await axios.get("/task" + taskId, auth);
  return res.data;
};

export const getAllTasks = async () => {
  const auth = getAuthHeader();
  const teamIds = getTeamIdArray(user.teams);
  const res = await axios.post("/get-all-tasks", teamIds, auth);
  return res.data;
};

//team api calls
export const getTeamTaskArr = async (teamIds) => {
  const res = await axios.post("/get-team-tasksArr", teamIds);
  return res.data;
};

export const getAllTeams = async () => {
  const auth = getAuthHeader();
  const res = await axios.get(`/get-all-teams`, auth);
  return res.data;
};

export const getTeamById = async (teamId) => {
  const auth = getAuthHeader();
  const res = await axios.get(`/get-team${teamId}`, auth);
  return res.data;
};

//general api calls
export const getCommentsById = async (id, type) => {
  const auth = getAuthHeader();
  const res = await axios.get(`/comments${id}/${type}`, auth);
  return res.data;
};
