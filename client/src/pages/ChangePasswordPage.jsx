import { Button } from "@material-tailwind/react";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authSelect } from "../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import InputController from "../components/InputController";

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
  newPassword: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
  confirmNewPassword: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
});

const ChangePasswordPage = () => {
  const { user } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: user?.email,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitChangePassword = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[620px] w-full bg-white shadow-md rounded -md flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleSubmitChangePassword)}
        className="flex items-center flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <InputController
            control={control}
            name="email"
            label="Email"
            error={errors?.email}
            isDisabel
          />
          <InputController
            control={control}
            name="currentPassword"
            label="Mật khẩu hiện tại"
            error={errors?.currentPassword}
          />
          <InputController
            control={control}
            name="newPassword"
            label="Mật khẩu mới"
            error={errors?.newPassword}
          />
          <InputController
            control={control}
            name="confirmNewPassword"
            label="Nhập lại mật khẩu mới"
            error={errors?.confirmNewPassword}
          />
        </div>
        <Button>Lưu</Button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
