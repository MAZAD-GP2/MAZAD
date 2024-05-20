import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
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
export const getUserStats = (id) => API.get(`/user/stats/${id}`);
export const getBidHistory = (id, page, limit) => API.get(`/user/getBidHistory/${id}?page=${page}&limit=${limit}`);
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
export const getAllItemsByUserId = (id, page, limit) => API.get(`/item/user/${id}?page=${page}&limit=${limit}`);
export const addItem = (data) =>
  API.post("/item/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editItem = (id, data) =>
  API.post(`/item/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteItem = (id) => API.delete(`/item/delete/${id}`);
export const hideItem = (id) => API.delete(`/item/hide/${id}`);
export const reenlistItem = (data) =>
  API.post("/item/reenlist", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const search = (data) => API.get(`/search?search=${data}`);

//interest
export const updateInterest = (id) => API.post(`/interest/add/${id}`);
export const removeInterest = (id) => API.delete(`/interest/remove/${id}`);

//auction
export const getAuctionById = (id) => API.get(`/auction/${id}`);
export const getAuctionByUser = (id) => API.get(`/auction/user/${id}`);
export const getAuctionCountByUser = (id) => API.get(`/bid/auction/${id}/count`);
export const getAuctionByItem = (id) => API.get(`/auction/item/${id}`);
export const addAuction = (data) => API.post("/auction/create", data);
export const updateAuction = (data) => API.put("/auction/update", data);
export const removeAuction = (id) => API.delete(`/auction/delete/${id}`);
export const toggleShowNumber = (id) => API.post(`/item/toggle-number/${id}`, );

//bid
export const getBidById = (id) => API.get(`/bid/${id}`);
export const getBidsByUser = (id) => API.get(`/bid/user/${id}`);
export const getBidCountByUser = (id) => API.get(`/bid/user/${id}/count`);
export const getBidsByAuction = (id, limit) =>
  API.get(`/bid/auction/${id}`, { params: { limit } });
export const addBid = (data) => API.post("/bid/create", data);
export const removeBid = (id) => API.delete(`/bid/auction/${id}`);

// auth
export const decodeToken = () => API.post(`/decode-token`);

// comment
export const addComment = (data) => API.post(`/comment/add`, data);

// Chat
export const getChatRooms = (id) => API.get(`/chat/getRooms/${id}`);
export const getRoomByUser = (id) => API.get(`/chat/getRoomByUser/${id}`);
export const getRoomById = (id) => API.get(`/chat/getRoomById/${id}`);
export const getMessagesInRoom = (id) => API.get(`/chat/getMessagesInRoom/${id}`);
export const sendMessage = (data) => API.post(`/chat/sendMessage`, data);
