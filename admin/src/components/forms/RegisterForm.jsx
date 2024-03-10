import React from "react";
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
import { useRegisterMutation } from "../../redux/features/apis/authApi";
import { useDispatch } from "react-redux";

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
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
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
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="bg-white py-8 rounded-3xl mx-auto w-full max-w-[24rem]"
      onSubmit={handleSubmit(onSubmitRegister)}
    >
      <Typography variant="h3" color="black" className="text-center">
        Đăng Ký
      </Typography>
      <CardBody className="flex flex-col gap-6">
        <div className="flex flex-col relative">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input label="Họ" {...field} error={!!errors.lastName} />
            )}
          />
          {!!errors.lastName && (
            <Typography color="red" className="absolute -bottom-6 text-sm">
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
            <Typography color="red" className="absolute -bottom-6 text-sm">
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
      </CardFooter>
      <Typography className="text-center text-sm text-black font-bold">
        Hoặc đăng nhập bằng
      </Typography>
    </form>
  );
};

export default RegisterForm;
