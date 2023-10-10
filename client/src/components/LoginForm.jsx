import React from "react";
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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useLogInMutation } from "../redux/features/apis/authApi";
import { setCredentials } from "../redux/features/slices/authSlice";
import Loading from "./Loading";

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
          className="bg-white py-8 rounded-3xl mx-auto w-full max-w-[24rem]"
          onSubmit={handleSubmit(onSubmitLogin)}
        >
          <Typography variant="h3" color="black" className="text-center">
            Đăng Nhập
          </Typography>
          <CardBody className="flex flex-col gap-6">
            <div className="flex flex-col relative">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input label="Email" {...field} error={!!errors.email} />
                )}
              />
              {!!errors.email && (
                <Typography color="red" className="absolute -bottom-6 text-sm">
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
                <Typography color="red" className="absolute -bottom-6 text-sm">
                  {errors.password?.message}
                </Typography>
              )}
            </div>
            <Typography className="text-right text-sm text-black font-bold">
              Quên mật khẩu
            </Typography>
          </CardBody>
          <CardFooter className="pt-0">
            <Button type="submit" variant="gradient" fullWidth>
              Đăng nhập
            </Button>
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
      </Dialog>
    </>
  );
};

export default LoginForm;
