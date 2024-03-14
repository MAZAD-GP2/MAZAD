import axios from "axios";

const API = axios.create({ baseURL: `http://localhost:${import.meta.env.VITE_PORT}` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("user"))}`;
  }

  return req;
});

export const login = (data) => API.post("/user/login", data);
export const register = (data) => API.post(`/user/register`, data);
export const getAllItems = () => API.get(`/item`);