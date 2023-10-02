import {
  Breadcrumbs,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputController from "../../components/InputController";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { icons } from "../../utils/icons";
import SelectController from "../../components/SelectController";
import {
  companyIndustryOptions,
  companySizesOptions,
  experiens,
  sexOptions,
} from "../../utils/constants";

import TextEditorController from "../../components/TextEditorController";
import axiosClient from "../../configs/axiosConfig";
import InputFileController from "../../components/InputFileController";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterEmployerMutation } from "../../redux/features/apis/employerApi";
import { authSelect } from "../../redux/features/slices/authSlice";

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Họ và tên là trường bắt buộc")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự")
    .max(50, "Họ và tên không được quá 50 ký tự"),
  phoneNumber: yup
    .string()
    .required("Số điện thoại là trường bắt buộc")
    .matches(
      /^[0-9]{10}$/,
      "Số điện thoại phải có đúng 10 chữ số và không chứa ký tự đặc biệt"
    ),
  sex: yup.string().required("Giới tính là trường bắt buộc"),
  workLocation: yup
    .string()
    .required("Địa điểm làm việc là trường bắt buộc")
    .max(100, "Địa điểm làm việc không được quá 100 ký tự"),
  companyLogo: yup.string().required("Logo công ty là trường bắt buộc"),
  companyName: yup
    .string()
    .required("Tên công ty là trường bắt buộc")
    .max(100, "Tên công ty không được quá 100 ký tự"),
  companyEmail: yup
    .string()
    .required("Email công ty là trường bắt buộc")
    .email("Email không hợp lệ"),
  companyPhoneNumber: yup
    .string()
    .required("Số điện thoại công ty là trường bắt buộc")
    .matches(
      /^[0-9]{10}$/,
      "Số điện thoại công ty phải có đúng 10 chữ số và không chứa ký tự đặc biệt"
    ),
  websiteUrl: yup.string().url("URL trang web không hợp lệ"),
  companyIndustry: yup
    .string()
    .required("Ngành công nghiệp là trường bắt buộc"),
  companySize: yup.string().required("Quy mô công ty là trường bắt buộc"),
  companyLocation: yup
    .string()
    .required("Địa điểm công ty là trường bắt buộc")
    .max(100, "Địa điểm công ty không được quá 100 ký tự"),
  companyDescription: yup
    .string()
    .required("Mô tả công ty là trường bắt buộc")
    .max(500, "Mô tả công ty không được quá 500 ký tự"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(authSelect);

  const [registerEmployer] = useRegisterEmployerMutation();

  const [workLocationsValue, setWorkLocationsValue] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      sex: "",
      workLocation: "",
      companyLogo: "",
      companyName: "",
      companyEmail: "",
      companyPhoneNumber: "",
      websiteUrl: "",
      companyIndustry: "",
      companySize: "",
      companyLocation: "",
      companyDescription: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchWorkLocationsApi = async () => {
      try {
        const response = await axiosClient.get("/province");
        if (response && response.data && response.data.results) {
          const provinceNames = response.data.results.map((item) => ({
            id: item.province_id,
            value: item.province_name,
          }));
          setWorkLocationsValue(provinceNames);
        }
      } catch (error) {}
    };
    fetchWorkLocationsApi();
  }, []);

  const handleSubmitRegisterEmployer = async (data) => {
    try {
      let formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      const response = await registerEmployer({ formData, userId: user._id });
      console.log(response.data.results);
      if (response && response.data && response.data.success) {
        navigate("/dashboard");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Breadcrumbs className="bg-white shadow-sm">
        <Link className="opacity-60" to="http://localhost:3000">
          Trang chủ
        </Link>
        <Link to="/register-employer" className="">
          Đăng ký nhà tuyển dụng
        </Link>
      </Breadcrumbs>
      <div className="p-5 rounded-md shadow-sm bg-white min-h-[calc(100vh-170px)]">
        <form
          className="bg-white p-4 w-full"
          onSubmit={handleSubmit(handleSubmitRegisterEmployer)}
        >
          <Timeline>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2 !bg-[#212f3f]">
                  <icons.IoBriefcase />
                </TimelineIcon>
                <Typography variant="h5" className="text-lg text-teal-800">
                  Thông tin nhà tuyển dụng
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputController
                    control={control}
                    name="fullName"
                    label="Họ và tên cá nhân"
                    error={errors?.fullName}
                  />
                  <InputController
                    control={control}
                    name="phoneNumber"
                    label="Số điện thoại cá nhân"
                    error={errors?.phoneNumber}
                    options={experiens}
                  />
                  <SelectController
                    control={control}
                    name="sex"
                    label="Giới tính"
                    error={errors?.sex}
                    options={sexOptions}
                  />
                  <SelectController
                    control={control}
                    name="workLocation"
                    label="Địa điểm làm việc"
                    error={errors?.workLocation}
                    options={workLocationsValue}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <icons.IoAddCircle />
                </TimelineIcon>
                <Typography variant="h5" className="text-lg text-teal-800">
                  Thông tin công ty
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputFileController
                    control={control}
                    name="companyLogo"
                    label="Logo công ty"
                    error={errors?.companyLogo}
                  />
                  <InputController
                    control={control}
                    name="companyName"
                    label="Tên công ty"
                    error={errors?.companyName}
                  />
                  <InputController
                    control={control}
                    name="companyEmail"
                    label="Email"
                    error={errors?.companyEmail}
                  />
                  <InputController
                    control={control}
                    name="companyPhoneNumber"
                    label="Số điện thoại"
                    error={errors?.companyPhoneNumber}
                  />
                  <InputController
                    control={control}
                    name="websiteUrl"
                    label="Website URL"
                    error={errors?.websiteUrl}
                  />
                  <SelectController
                    control={control}
                    name="companyIndustry"
                    label="Lĩnh vực hoạt động"
                    error={errors?.companyIndustry}
                    options={companyIndustryOptions}
                  />
                  <SelectController
                    control={control}
                    name="companySize"
                    label="Quy mô công ty"
                    error={errors?.companySize}
                    options={companySizesOptions}
                  />
                  <InputController
                    control={control}
                    name="companyLocation"
                    label="Địa chỉ công ty"
                    error={errors?.companyLocation}
                  />
                  <TextEditorController
                    control={control}
                    name="companyDescription"
                    label="Mô tả công ty"
                    error={errors?.companyDescription}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineIcon className="p-2">
                  <icons.BsCheckCircleFill />
                </TimelineIcon>
                <Typography variant="h5" className="text-lg text-teal-800">
                  Hoàn thành
                </Typography>
                <div className="ml-[100px] flex items-center justify-center">
                  <Button type="submit">Tiếp tục</Button>
                </div>
              </TimelineHeader>
            </TimelineItem>
          </Timeline>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
