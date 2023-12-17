import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { authSelect } from "../../redux/features/slices/authSlice";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector(authSelect);

  useEffect(() => {
    if (isLoggedIn && user && user.ownerEmployerId) {
      navigate("/dashboard");
    }
    if (!isLoggedIn) {
      navigate("/login");
    }
    if (user && !user.ownerEmployerId) {
      navigate("/register-employer");
    }
  }, [isLoggedIn]);

  return <Outlet />;
};

export default ProtectedRoutes;
