import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputController from "../../components/InputController";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { icons } from "../../utils/icons";
import SelectController from "../../components/SelectController";
import {
  companyIndustryOptions,
  companySizesOptions,
} from "../../utils/constants";

import TextEditorController from "../../components/TextEditorController";
import InputFileController from "../../components/InputFileController";
import { useDispatch, useSelector } from "react-redux";
import { useGetEmployerDetailQuery } from "../../redux/features/apis/employerApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import { setTitle } from "../../redux/features/slices/titleSlice";

const schema = yup.object().shape({
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

const CompanyProfilePage = () => {
  const { user } = useSelector(authSelect);

  const { data: employerData } = useGetEmployerDetailQuery({
    userId: user?._id,
    employerId: user?.ownerEmployerId?._id,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      companyLogo: employerData?.data?.companyLogo,
      companyName: employerData?.data?.companyName,
      companyEmail: employerData?.data?.companyEmail,
      companyPhoneNumber: employerData?.data?.companyPhoneNumber,
      websiteUrl: employerData?.data?.websiteUrl,
      companyIndustry: employerData?.data?.companyIndustry,
      companySize: employerData?.data?.companySize,
      companyLocation: employerData?.data?.companyLocation,
      companyDescription: employerData?.data?.companyDescription,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(setTitle("Thông tin công ty"));
  }, [dispatch]);

  const handleSubmitRegisterEmployer = async (data) => {
    try {
      // let formData = new FormData();
      // for (const key in data) {
      //   if (data.hasOwnProperty(key)) {
      //     formData.append(key, data[key]);
      //   }
      // }
      // const response = await registerEmployer({ formData, userId: user._id });
      // console.log(response.data.results);
      // if (response && response.data && response.data.success) {
      //   navigate("/dashboard");
      // }
    } catch (error) {}
  };

  return (
    <div className="mx-[120px] my-[20px] p-5 rounded-md shadow-sm bg-white min-h-[calc(100vh-170px)]">
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
                  imgUrlPreview={employerData?.data?.companyLogo}
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
                <Button type="submit">Cập nhật thông tin</Button>
              </div>
            </TimelineHeader>
          </TimelineItem>
        </Timeline>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
