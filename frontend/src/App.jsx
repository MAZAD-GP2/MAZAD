import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import * as api from "./api/index";
import loadable from "@loadable/component";
import Chat from "./pages/Chat.jsx";
import IsUser from "./components/Auth/IsUser.jsx";

const Home = loadable(() => import("./pages/Home.jsx"));
const Register = loadable(() => import("./pages/auth/Register.jsx"));
const Login = loadable(() => import("./pages/auth/Login.jsx"));
const ForgotPassword = loadable(() =>
  import("./pages/auth/ForgotPassword.jsx")
);
const ResetPassword = loadable(() => import("./pages/auth/ResetPassword.jsx"));
const AddItem = loadable(() => import("./pages/AddItem.jsx"));
const CategoryItems = loadable(() => import("./pages/CategoryItems.jsx"));
const ViewItem = loadable(() => import("./pages/ViewItem.jsx"));
const Profile = loadable(() => import("./pages/Profile.jsx"));
const LandingPage = loadable(() => import("./pages/LandingPage.jsx"));
const SearchResult = loadable(() => import("./pages/SearchResult.jsx"));
const Favorites = loadable(() => import("./pages/Favorites.jsx"));
const NotFound = loadable(() => import("./components/NotFound.jsx"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const decodeToken = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user) {
        try {
          const result = await api.decodeToken();
          setIsLoggedIn(true);
          setIsAdmin(result.data.isAdmin);
        } catch (error) {
          console.log(error);
          sessionStorage.clear();
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      }
    };
    decodeToken();
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route element={<IsUser/>}>
          <Route element={<Profile />} path="/profile" exact/>
          <Route element={<Profile />} path="/profile/:id" exact/>
          <Route element={<AddItem />} path="/add-item" exact/>
          <Route element={<Favorites />} path="/favorites" exact/>
          <Route path="/chat" element={<Chat />} exact/>
          <Route path="/chat/:userId" element={<Chat />} exact/>
        </Route>
        <Route exact path="/search" element={<SearchResult />} />
        <Route exact path="/category-item/:id" element={<CategoryItems />} />
        <Route exact path="/item/:id" element={<ViewItem />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
