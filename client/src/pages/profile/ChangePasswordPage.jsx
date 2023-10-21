import { Breadcrumbs, Button } from "@material-tailwind/react";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import InputController from "../../components/InputController";
import { Link } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import { useReplacePasswordMutation } from "../../redux/features/apis/authApi";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
  newPassword: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
  confirmPassword: yup
    .string()
    .min(6, "Mật khẩu ít nhất phải có 6 ký tự")
    .required("Mật khẩu không được bỏ trống"),
});

const ChangePasswordPage = () => {
  const { user } = useSelector(authSelect);

  const [replacePassword, { isLoading }] = useReplacePasswordMutation();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: user?.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitChangePassword = async (data) => {
    try {
      const response = await replacePassword({ data, userId: user?._id });
      if (response?.data?.success) {
        reset();
        toast.success("Đổi mật khẩu thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {isLoading && <Loading />}
      <Breadcrumbs fullWidth className="!bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/change-password" className="font-bold text-sm">
          Thay đổi mật khẩu
        </Link>
      </Breadcrumbs>
      <form
        onSubmit={handleSubmit(handleSubmitChangePassword)}
        className="flex items-center justify-center min-h-[calc(100vh-156px)] flex-col gap-4 bg-white rounded-md "
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
            name="confirmPassword"
            label="Nhập lại mật khẩu mới"
            error={errors?.confirmPassword}
          />
        </div>
        <ButtonCustom type="submit">Đổi mật khẩu</ButtonCustom>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
