import axios from "axios";

const API = axios.create({ baseURL: `http://localhost:${import.meta.env.VITE_PORT}` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("userToken")}`;
  }

  return req;
});

export const login = (data) => API.post("/user/login", data);
export const register = (data) => API.post(`/user/register`, data);
export const getAllItems = () => API.get(`/item`);

export const decodeToken = () => API.post(`/decode-token`);