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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { icons } from "../../utils/icons";
import {
  companyIndustryOptions,
  companySizesOptions,
} from "../../utils/constants";
import axiosClient from "../../configs/axiosConfig";
import {
  InputFileController,
  TextEditorController,
  SelectController,
  InputController,
} from "../../components/forms";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterEmployerMutation } from "../../redux/features/apis/employerApi";
import { authSelect, updateUser } from "../../redux/features/slices/authSlice";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { toast } from "react-toastify";

const schema = yup.object().shape({
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
  companyDescription: yup
    .string()
    .required("Mô tả công ty là trường bắt buộc")
    .max(1000, "Mô tả công ty không được quá 500 ký tự"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(authSelect);

  const [registerEmployer] = useRegisterEmployerMutation();

  const [provincesValue, setProvincesValue] = useState([]);
  const [districtsValue, setDistrictsValue] = useState([]);
  const [wardsValue, setWardsValue] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      companyLogo: "",
      companyName: "",
      companyEmail: "",
      companyPhoneNumber: "",
      websiteUrl: "",
      companyIndustry: "",
      companySize: "",
      province: "",
      district: "",
      ward: "",
      exactAddress: "",
      companyDescription: "",
    },
    resolver: yupResolver(schema),
  });

  const province = watch("province");
  const district = watch("district");

  useEffect(() => {
    dispatch(setTitle("Đăng ký nhà tuyển dụng"));
  }, [dispatch]);

  useEffect(() => {
    const fetchWorkLocationsApi = async () => {
      try {
        const response = await axiosClient.get("/province");
        if (response && response.data && response.data.results) {
          const provinceNames = response.data.results.map((item) => ({
            id: item.province_id,
            value: item.province_name,
          }));
          setProvincesValue(provinceNames);
        }
        if (JSON.parse(province).id) {
          const response = await axiosClient.get(
            `/province/district/${JSON.parse(province).id}`
          );
          if (response && response.data && response.data.results) {
            const districtNames = response.data.results.map((item) => ({
              id: item.district_id,
              value: item.district_name,
            }));
            setDistrictsValue(districtNames);
          }
        }
        if (JSON.parse(district).id) {
          const response = await axiosClient.get(
            `/province/ward/${JSON.parse(district).id}`
          );
          if (response && response.data && response.data.results) {
            const wardNames = response.data.results.map((item) => ({
              id: item.ward_id,
              value: item.ward_name,
            }));
            setWardsValue(wardNames);
          }
        }
      } catch (error) {}
    };
    fetchWorkLocationsApi();
  }, [province, district]);

  const handleSubmitRegisterEmployer = async (data) => {
    try {
      let formatData = { ...data };
      for (const key in formatData) {
        if (formatData.hasOwnProperty(key)) {
          const value = formatData[key];

          try {
            const parsedValue = JSON.parse(value);

            if (parsedValue.hasOwnProperty("value")) {
              formatData[key] = parsedValue.value;
            }
          } catch (error) {}
        }
      }

      let formData = new FormData();
      for (const key in formatData) {
        if (formatData.hasOwnProperty(key)) {
          formData.append(key, formatData[key]);
        }
      }

      for (const value of formData.values()) {
        console.log(value);
      }

      const response = await registerEmployer({ formData, userId: user._id });
      if (response && response.data && response.data.success) {
        dispatch(updateUser({ data: response.data.data }));
        toast.success("Đăng ký nhà tuyển dụng thành công");
        navigate("/dashboard");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Breadcrumbs fullWidth className="!bg-white">
        <Link
          to="http://localhost:3000"
          target="_blank"
          className="text-light-blue-500 text-sm font-bold"
        >
          Trang chủ
        </Link>
        <Link to="/change-password" className="font-bold text-sm">
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
                  <SelectController
                    control={control}
                    name="province"
                    label="Tỉnh / Thành Phố"
                    error={errors?.province}
                    options={provincesValue}
                  />
                  <SelectController
                    control={control}
                    name="district"
                    label="Quận / Huyện"
                    error={errors?.district}
                    options={districtsValue}
                  />
                  <SelectController
                    control={control}
                    name="ward"
                    label="Phường / Xã"
                    error={errors?.ward}
                    options={wardsValue}
                  />
                  <InputController
                    control={control}
                    name="exactAddress"
                    label="Địa chỉ chính xác"
                    error={errors?.exactAddress}
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
