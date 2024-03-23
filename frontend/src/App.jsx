import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      api
        .decodeToken()
        .then((result) => {
          setIsLoggedIn(true);
          result.data.isAdmin ? setIsAdmin(true) : setIsAdmin(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      sessionStorage.clear();
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        <Route exact path="/add-item" element={<AddItem />} />
        <Route exact path="/category-item/:id" element={<CategoryItems />} />

        {/* Restricted Routes */}
        {/* {isLoggedIn && isAdmin && (
          <Route exact path="/admin" element={<AdminPage />} />
        )} */}
        {/* {isLoggedIn && <Route exact path="/user" element={<UserPage />} />} */}

        {/* Redirect to login if user tries to access restricted routes */}
        {!isLoggedIn && (
          <Route path="/admin" element={<Navigate to="/login" />} />
        )}
        {!isLoggedIn && (
          <Route path="/user" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
