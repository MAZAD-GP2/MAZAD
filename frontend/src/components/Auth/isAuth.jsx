import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../../pages/Home'
import Register from '../../pages/auth/Register'
import Profile from '../../pages/Profile'
import Login from '../../pages/auth/Login'
import EditProfile from '../../pages/EditProfile'
import ForgotPassword from '../../pages/auth/ForgotPassword'
import ResetPassword from '../../pages/auth/ResetPassword'
import AddItem from '../../pages/AddItem'
import Favorites from '../../pages/Favorites'
export default function AuthRoute({isLoggedIn}) {
    console.log(isLoggedIn);
    return (
        <>
        {isLoggedIn && <Route path="/register" element={<Home />} />}
        {!isLoggedIn && <Route exact path="/register" element={<Register />} />}

        {isLoggedIn && <Route path="/profile" element={<Profile />} />}
        {!isLoggedIn && <Route exact path="/profile" Navigate={<Login />} />}
        
        {isLoggedIn && <Route path="/profile/:id" element={<Profile />} />}
        {!isLoggedIn && <Route exact path="/profile/:id" Navigate={<Login />} />}

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

        {isLoggedIn && <Route path="/favorites" element={<Favorites />} />}
        {!isLoggedIn && <Route exact path="/favorites" element={<Login />} />}
      </>
    )
    }