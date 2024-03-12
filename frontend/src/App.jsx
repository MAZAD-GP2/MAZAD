import { Routes, Route } from "react-router-dom";
// import Register from "./pages/auth/Register.jsx";
// import Login from "./pages/auth/Login.jsx";
// import Home from "./pages/Home.jsx";
// import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
// import ResetPassword from "./pages/auth/ResetPassword.jsx";
import loadable from '@loadable/component'

const Home = loadable(() => import('./pages/Home.jsx'));
const Register = loadable(() => import('./pages/auth/Register.jsx'));
const Login = loadable(() => import('./pages/auth/Login.jsx'));
const ForgotPassword = loadable(() => import('./pages/auth/ForgotPassword.jsx'));
const  ResetPassword = loadable(() => import('./pages/auth/ResetPassword.jsx'));


function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/reset-password" element={<ResetPassword />} />
        {/* <Route exact path="/admin" element={<ResetPassword />} /> */}
      </Routes>
    </>
  );
}

export default App;
