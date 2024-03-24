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

        {isLoggedIn && <Route path="/register" element={<Home />} />}
        {!isLoggedIn && <Route exact path="/register" element={<Register />} />}

        {isLoggedIn && <Route path="/login" element={<Home />} />}
        {!isLoggedIn && <Route exact path="/login" element={<Login />} />}

        {isLoggedIn && <Route path="/forgot-password" element={<Home />} />}
        {!isLoggedIn && (
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
        )}

        {isLoggedIn && <Route path="/reset-password" element={<Home />} />}
        {!isLoggedIn && (
          <Route exact path="/reset-password" element={<ResetPassword />} />
        )}

        {isLoggedIn && <Route path="/add-item" element={<AddItem />} />}
        {!isLoggedIn && <Route exact path="/add-item" element={<Login />} />}

        <Route exact path="/category-item/:id" element={<CategoryItems />} />
      </Routes>
    </>
  );
}

export default App;
