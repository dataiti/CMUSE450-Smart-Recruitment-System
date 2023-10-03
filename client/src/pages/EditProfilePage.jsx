import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { authSelect } from "../redux/features/slices/authSlice";
import InputController from "../components/InputController";
import { Button } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useReactToPrint } from "react-to-print";

const schema = Yup.object().shape({
  firstName: Yup.string().required("Tên không được để trống"),
  lastName: Yup.string().required("Họ không được để trống"),
  phoneNumber: Yup.string().matches(
    /^[0-9]{10}$/,
    "Số điện thoại phải có 10 chữ số"
  ),
});

const EditProfilePage = () => {
  const { user } = useSelector(authSelect);

  const conponentPDF = useRef();
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Userdata",
    onAfterPrint: () => alert("Data saved in PDF"),
  });

  return (
    <div className="h-[620px] w-full bg-white shadow-md rounded -md flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleSubmitChangePassword)}
        className="flex items-center flex-col gap-4"
      >
        <div className="flex flex-col gap-4" ref={conponentPDF}>
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
            label="Tên"
            error={errors?.firstName}
          />
          <InputController
            control={control}
            name="lastName"
            label="Họ"
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
        <Button className="" onClick={generatePDF}>
          PDF
        </Button>
      </form>
    </div>
  );
};

export default EditProfilePage;
