import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { authSelect } from "../../redux/features/slices/authSlice";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(authSelect);

  if (!isLoggedIn) {
    navigate("/");
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
