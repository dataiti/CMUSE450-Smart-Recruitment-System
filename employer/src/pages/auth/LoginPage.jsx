import React, { useEffect } from "react";
import { LoginForm } from "../../components/forms";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Đăng nhập"));
  }, [dispatch]);

  return <LoginForm />;
};

export default LoginPage;
