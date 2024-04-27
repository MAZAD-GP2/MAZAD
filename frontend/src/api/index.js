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
export const forgotPassword = (data) => API.post(`/user/forgot-password`, data);
export const resetPassword = (data) => API.post(`/user/reset-password`, data);
export const getUserById = (id) => API.get(`/user/${id}`);
export const userUpdate = (data) => API.put(`/user/update`, data);
export const passwordUpdate = (data) => API.put(`/user/password-update`, data);
//categories
export const getAllCategories = () => API.get("/category");
//tags
export const getAllTags = () => API.get("/tag");
export const searchTags = (query) => API.get(`/tag/search/${query}`);

//items
export const getAllItems = (query) => API.get(`/item?${query}`);
export const getAllItemsByCategory = (id) => API.get(`/item/category/${id}`);
export const getAllItemsByFavorites = () => API.get(`/item/favorites`);
export const getItemById = (id) => API.get(`/item/${id}`);
export const addItem = (data) =>
  API.post("/item/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteItem = (id) => API.delete(`/item/delete/${id}`);
export const updateInterest = (id) => API.post(`/interest/add/${id}`);
export const removeInterest = (id) => API.delete(`/interest/remove/${id}`);

export const getAuctionById = (id) => API.get(`/auction/${id}`);
export const getAuctionByUser = (id) => API.get(`/auction/user/${id}`);
export const addAuction = (data) => API.post("/auction/create", data);
export const updateAuction = (data) => API.put("/auction/update", data);
export const removeAuction = (id) => API.delete(`/auction/delete/${id}`);

export const getBidById = (id) => API.get(`/bid/${id}`);
export const getBidsByUser = (id) => API.get(`/bid/user/${id}`);
export const getBidsByAuction = (id) => API.get(`/bid/auction/${id}`);
export const addBid = (data) => API.post("/bid/create", data);
export const removeBid = (id) => API.delete(`/bid/auction/${id}`);

export const decodeToken = () => API.post(`/decode-token`);
export const search = (data) => API.get(`/search?search=${data}`);
