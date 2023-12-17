import React, { useEffect } from "react";
import { RegisterForm } from "../../components/forms";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { useDispatch } from "react-redux";

const RegisterPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle("Đăng ký"));
  }, [dispatch]);

  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
