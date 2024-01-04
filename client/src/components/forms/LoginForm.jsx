import React, { useState } from "react";
import {
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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useLogInMutation } from "../../redux/features/apis/authApi";
import { setCredentials } from "../../redux/features/slices/authSlice";
import { ButtonCustom, Loading } from "../shares";
import { SocialLoginForm } from "../forms";
import { icons } from "../../utils/icons";

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

const LoginForm = ({ open, handleOpen }) => {
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLogInMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  return (
    <>
      {isLoading && <Loading />}
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
        aria-labelledby="customized-dialog-title"
      >
        <form
          className="bg-white py-8 rounded-3xl mx-auto w-full max-w-[22rem]"
          onSubmit={handleSubmit(onSubmitLogin)}
        >
          <Typography
            color="black"
            className="text-center uppercase text-xl font-extrabold"
          >
            Đăng Nhập
          </Typography>
          <CardBody className="flex flex-col gap-6">
            <div className="flex flex-col relative">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email"
                    {...field}
                    error={!!errors.email}
                    spellCheck={false}
                    color="blue"
                  />
                )}
              />
              {!!errors.email && (
                <Typography
                  color="red"
                  className="absolute -bottom-4 text-xs font-bold"
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
                    type={showPassword ? "text" : "password"}
                    label="Mật khẩu"
                    {...field}
                    error={!!errors.password}
                    color="blue"
                  />
                )}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <span>
                    <icons.IoMdEyeOff size={18} />
                  </span>
                ) : (
                  <span>
                    <icons.IoEye size={18} />
                  </span>
                )}
              </button>
              {!!errors.password && (
                <Typography
                  color="red"
                  className="absolute -bottom-4 text-xs font-bold"
                >
                  {errors.password?.message}
                </Typography>
              )}
            </div>
          </CardBody>
          <CardFooter className="!py-0">
            <Typography className="pb-2 text-right text-xs font-medium text-black">
              Quên mật khẩu
            </Typography>
            <div className="relative">
              <ButtonCustom
                type="submit"
                fullWidth
                className="text-[#0891b2] !bg-[#212f3f] rounded-full"
              >
                Đăng nhập
              </ButtonCustom>
              {errorMessage && (
                <Typography
                  className="w-full absolute -bottom-5 text-xs font-bold"
                  color="red"
                >
                  {errorMessage}
                </Typography>
              )}
            </div>
            <Typography
              variant="small"
              className="mt-6 flex justify-center font-medium"
            >
              Bạn chưa đã có tài khoản?
              <Link
                variant="small"
                className="ml-1 text-sm font-bold text-blue-500"
                onClick={handleOpen}
              >
                Đăng ký ngay
              </Link>
            </Typography>
            <Typography className="text-center text-sm text-black font-bold">
              Hoặc đăng nhập bằng
            </Typography>
            <SocialLoginForm />
          </CardFooter>
        </form>
      </Dialog>
    </>
  );
};

export default LoginForm;
