import axios from "axios";

const API_URL_AUTHENT = "http://localhost:4000";
const API_URL_TASKS = "http://localhost:5001";

export const apiClientAuthent = axios.create({
  baseURL: API_URL_AUTHENT,
  withCredentials: true, // cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClientTasks = axios.create({
  baseURL: API_URL_TASKS,
  withCredentials: true, // cookies
  headers: {
    "Content-Type": "application/json",
  },
});
