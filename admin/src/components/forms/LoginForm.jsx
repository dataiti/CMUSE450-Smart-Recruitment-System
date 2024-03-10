import React, { useState } from "react";
import {
  Button,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogInMutation } from "../../redux/features/apis/authApi";
import {
  authSelect,
  setCredentials,
} from "../../redux/features/slices/authSlice";
import { Loading } from "../shares";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được bỏ trống"),
  password: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
});

const LoginForm = ({ handleOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useSelector(authSelect);

  const [login, { isLoading }] = useLogInMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmitLogin = async (data) => {
    try {
      if (data) {
        const response = await login(data);
        if (response && response.data && response.data.success) {
          dispatch(
            setCredentials({
              user: response?.data?.data,
              accessToken: response?.data?.accessToken,
              refreshToken: response?.data?.refreshToken,
            })
          );
          toast.success("Đăng nhập thành công !");
          reset();
        } else if (response && response.data && !response.data.success) {
          setErrorMessage("Email hoặc mật khẩu không chính xác");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (user) navigate("/dashboard");

  return (
    <div>
      {isLoading && <Loading />}
      <form
        className="bg-white py-8 rounded-3xl mx-auto w-full max-w-[22rem]"
        onSubmit={handleSubmit(onSubmitLogin)}
      >
        <Typography variant="h3" color="black" className="text-center">
          Đăng Nhập
        </Typography>
        <CardBody className="flex flex-col gap-5">
          <div className="flex flex-col relative">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input label="Email" {...field} error={!!errors.email} />
              )}
            />
            {!!errors.email && (
              <Typography color="red" className="absolute -bottom-5 text-xs">
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
              <Typography color="red" className="absolute -bottom-5 text-xs">
                {errors.password?.message}
              </Typography>
            )}
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography className="pb-2 text-right text-xs text-black">
            Quên mật khẩu
          </Typography>
          <div className="relative">
            <Button type="submit" variant="gradient" fullWidth>
              Đăng nhập
            </Button>
            {errorMessage && (
              <Typography
                className="w-full absolute -bottom-5 text-xs"
                color="red"
              >
                {errorMessage}
              </Typography>
            )}
          </div>
          <Typography variant="small" className="mt-6 flex justify-center">
            Bạn chưa đã có tài khoản?
            <Link
              variant="small"
              className="ml-1 font-bold text-blue-500"
              onClick={handleOpen}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </CardFooter>
        <Typography className="text-center text-sm text-black font-bold">
          Hoặc đăng nhập bằng
        </Typography>
      </form>
    </div>
  );
};

export default LoginForm;
