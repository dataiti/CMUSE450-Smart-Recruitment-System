import React, { useState } from "react";
import {
  Button,
  Dialog,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegisterMutation } from "../../redux/features/apis/authApi";
import { Loading } from "../shares";
import SocialLoginForm from "./SocialLoginForm";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/slices/authSlice";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  firstName: yup.string().required("Tên không được bỏ trống"),
  lastName: yup.string().required("Họ không được bỏ trống"),
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được bỏ trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
});

const RegisterForm = ({ open, handleOpen }) => {
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmitRegister = async (data) => {
    try {
      if (data) {
        const response = await register(data);
        if (response && response.data && response.data.success) {
          dispatch(
            setCredentials({
              user: response?.data?.data,
              accessToken: response?.data?.accessToken,
              refreshToken: response?.data?.refreshToken,
            })
          );
          toast.success("Đăng ký thành công !");
          reset();
        } else if (response && response.data && !response.data.success) {
          setErrorMessage("Email đã tồn tại");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
      aria-labelledby="customized-dialog-title"
    >
      {isLoading && <Loading />}
      <form
        className="bg-white p-4 rounded-3xl mx-auto w-full max-w-[24rem]"
        onSubmit={handleSubmit(onSubmitRegister)}
      >
        <Typography className="text-center text-3xl text-black font-extrabold">
          Đăng Ký
        </Typography>
        <CardBody className="flex flex-col gap-5">
          <div className="flex flex-col relative">
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input label="Họ" {...field} error={!!errors.lastName} />
              )}
            />
            {!!errors.lastName && (
              <Typography
                color="red"
                className="absolute font-bold -bottom-4 text-xs"
              >
                {errors.lastName?.message}
              </Typography>
            )}
          </div>
          <div className="flex flex-col relative">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input label="Tên" {...field} error={!!errors.firstName} />
              )}
            />
            {!!errors.firstName && (
              <Typography
                color="red"
                className="absolute font-bold -bottom-4 text-xs"
              >
                {errors.firstName?.message}
              </Typography>
            )}
          </div>
          <div className="flex flex-col relative">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input label="Email" {...field} error={!!errors.email} />
              )}
            />
            {!!errors.email && (
              <Typography
                color="red"
                className="absolute font-bold -bottom-4 text-xs"
              >
                {errors.email?.message}
              </Typography>
            )}
          </div>
          <div className="flex flex-col relative">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  label="Mật khẩu"
                  {...field}
                  error={!!errors.password}
                />
              )}
            />
            {!!errors.password && (
              <Typography
                color="red"
                className="absolute font-bold -bottom-4 text-xs"
              >
                {errors.password?.message}
              </Typography>
            )}
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button type="submit" variant="gradient" fullWidth>
            Đăng ký
          </Button>
          <Typography variant="small" className="mt-6 flex justify-center">
            Bạn đã có tài khoản?
            <Link
              variant="small"
              className="ml-1 font-bold text-blue-500"
              onClick={handleOpen}
            >
              Đăng nhập ngay
            </Link>
          </Typography>
          <Typography className="text-center text-sm text-black font-bold">
            Hoặc đăng nhập bằng
          </Typography>
          <SocialLoginForm />
        </CardFooter>
      </form>
    </Dialog>
  );
};

export default RegisterForm;
