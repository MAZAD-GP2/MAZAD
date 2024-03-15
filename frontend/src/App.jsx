import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as api from "./api/index";

// import Register from "./pages/auth/Register.jsx";
// import Login from "./pages/auth/Login.jsx";
// import Home from "./pages/Home.jsx";
// import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
// import ResetPassword from "./pages/auth/ResetPassword.jsx";
import loadable from "@loadable/component";

const Home = loadable(() => import("./pages/Home.jsx"));
const Register = loadable(() => import("./pages/auth/Register.jsx"));
const Login = loadable(() => import("./pages/auth/Login.jsx"));
const ForgotPassword = loadable(() =>
  import("./pages/auth/ForgotPassword.jsx")
);
const ResetPassword = loadable(() => import("./pages/auth/ResetPassword.jsx"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("Checking user data 1");
    const token = localStorage.getItem("userToken");
    if (token) {
      api
        .decodeToken()
        .then((result) => {
          setIsLoggedIn(true);
          result.data.isAdmin ? setIsAdmin(true) : setIsAdmin(false);
        })
        .catch((err) => {
          setIsLoggedIn(true);
          setIsAdmin(false);
        });
    } else {
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

        {/* Restricted Routes */}
        {isLoggedIn && isAdmin && (
          <Route exact path="/admin" element={<AdminPage />} />
        )}
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
