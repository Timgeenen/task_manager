import axios from "axios";
import { BACKEND } from "../library/constants";

axios.defaults.baseURL = BACKEND;

export const getTaskById = async (taskId) => {
  const res = await axios.get("/task" + taskId);
  return res.data;
}