import React from "react";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { InputController } from "../../components/forms";
import { Button } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  firstName: Yup.string().required("Tên không được để trống"),
  lastName: Yup.string().required("Họ không được để trống"),
  phoneNumber: Yup.string().matches(
    /^[0-9]{10}$/,
    "Số điện thoại phải có 10 chữ số"
  ),
});

const UserProfilePage = () => {
  const { user } = useSelector(authSelect);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber || "",
    },
    resolver: yupResolver(schema),
  });

  const handleSubmitChangePassword = async (data) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-[110px] py-[40px]">
      <form
        onSubmit={handleSubmit(handleSubmitChangePassword)}
        className="flex items-center justify-center flex-col gap-4 bg-white rounded-md min-h-[calc(100vh-156px)]"
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
            name="firstName"
            label="Họ"
            error={errors?.firstName}
          />
          <InputController
            control={control}
            name="lastName"
            label="Tên"
            error={errors?.lastName}
          />
          <InputController
            control={control}
            name="phoneNumber"
            label="Số điện thoại"
            error={errors?.phoneNumber}
          />
        </div>
        <Button>Lưu</Button>
      </form>
    </div>
  );
};

export default UserProfilePage;
