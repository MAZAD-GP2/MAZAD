import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as api from "./api/index";
import loadable from "@loadable/component";

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
const EditProfile = loadable(() => import("./pages/EditProfile.jsx"));
const LandingPage = loadable(() => import("./pages/LandingPage.jsx"));

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

        {isLoggedIn && <Route path="/register" element={<Home />} />}
        {!isLoggedIn && <Route exact path="/register" element={<Register />} />}

        {isLoggedIn && <Route path="/profile" element={<Profile />} />}
        {!isLoggedIn && <Route exact path="/profile" Navigate={<Login />} />}
        <Route exact path="/profile/:id" element={<Profile />} />

        {isLoggedIn && <Route path="/edit-profile" element={<EditProfile />} />}
        {!isLoggedIn && <Route path="/edit-profile" Navigate={<Login />} />}

        {isLoggedIn && <Route path="/login" Navigate={<Home />} />}
        {!isLoggedIn && <Route exact path="/login" element={<Login />} />}

        {isLoggedIn && <Route path="/forgot-password" Navigate={<Home />} />}
        {!isLoggedIn && <Route exact path="/forgot-password" element={<ForgotPassword />} />}

        {isLoggedIn && <Route path="/reset-password" Navigate={<Home />} />}
        {!isLoggedIn && <Route exact path="/reset-password" element={<ResetPassword />} />}

        {isLoggedIn && <Route path="/add-item" element={<AddItem />} />}
        {!isLoggedIn && <Route exact path="/add-item" element={<Login />} />}

        <Route exact path="/category-item/:id" element={<CategoryItems />} />
        <Route exact path="/item/:id" element={<ViewItem />} />
      </Routes>
    </>
  );
}

export default App;
