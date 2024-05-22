import { Outlet, Navigate } from 'react-router-dom';

const IsUser = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  return (
    user?.token ? <Outlet /> : <Navigate to='/login' />
  )
}

export default IsUser;