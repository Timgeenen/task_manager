import axios from "axios";
import { BACKEND } from "../library/constants";
import { getTeamIdArray } from "../library/helperfunctions";
import { store } from "../redux/store";
import { logout } from "../redux/state/authSlice";

axios.defaults.baseURL = BACKEND + "/api";
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  response => response,
  error => {

    if(error.response && (
      error.response.message === "Invalid refresh-token"||
      error.response.message === "No refresh-token provided"
    )) {
      store.dispatch(logout());
      alert("Your session has expired, please log in again");
    }

  return Promise.reject(error);
  }
)

//user api calls
export const authenticateUser = async ({ data, signal }) => {
  const res = await axios.post("/login", { data, signal });
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post("logout");
  return res.data;
}

export const createUser = async ({ data, signal }) => {
  const res = await axios.post("/register", { data, signal });
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axios.get("/connections");
  return res.data;
};

export const getConnections = async (idArray) => {
  const res = await axios.post("/get-connected", idArray);
  return res.data;
};

export const addConnection = async (id) => {
  const res = await axios.put("/add-connection", { id });
  return res.data;
};

export const getAllNotifications = async (unreadOnly) => {
  let route = `/notifications${unreadOnly ? "?unread=true" : ""}`;
  const res = await axios.get(route);
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await axios.get(`/user${userId}`);
  return res.data;
};

//task api calls
export const getTaskById = async (taskId) => {
  const res = await axios.get("/task" + taskId);
  return res.data;
};

export const getAllTasks = async (teams) => {
  const teamIds = getTeamIdArray(teams);
  const res = await axios.post("/get-all-tasks", teamIds);
  return res.data;
};

//team api calls

export const getAllTeams = async () => {
  const res = await axios.get(`/get-all-teams`);
  return res.data;
};

export const getTeamById = async (teamId) => {
  const res = await axios.get(`/get-team${teamId}`);
  return res.data;
};

//general api calls
export const getCommentsById = async (id, type) => {
  const res = await axios.get(`/comments${id}/${type}`);
  return res.data;
};

export const authorizeUser = async () => {
  const res = await axios.get("/authorize");
  return res.data;
}