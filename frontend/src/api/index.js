import axios from "axios";

const API = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }

  return req;
});

//user
export const login = (data) => API.post("/user/login", data);
export const register = (data) => API.post(`/user/register`, data);
export const getUserById = (id) => API.get(`/user/${id}`);
export const userUpdate = (data) => API.put(`/user/update`, data)

//categories
export const getAllCategories = () => API.get("/category");

//items
export const getItemById = (id) => API.get(`/item/${id}`);
export const getAllItemsByCategory = (id) => API.get(`/item/category/${id}`);
export const getAllItems = () => API.get(`/item`);
export const addItem = (data) =>
  API.post("/item/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  
export const decodeToken = () => API.post(`/decode-token`);
