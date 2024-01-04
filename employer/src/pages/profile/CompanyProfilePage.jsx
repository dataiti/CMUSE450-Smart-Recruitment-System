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
import {
  InputController,
  SelectController,
  TextEditorController,
  InputFileController,
} from "../../components/forms";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { icons } from "../../utils/icons";
import {
  companyIndustryOptions,
  companySizesOptions,
} from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
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

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
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
      companyLocation: "",
      companyDescription: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user?.ownerEmployerId) {
      reset({
        companyLogo: user?.ownerEmployerId?.companyLogo,
        companyName: user?.ownerEmployerId?.companyName,
        companyEmail: user?.ownerEmployerId?.companyEmail,
        companyPhoneNumber: user?.ownerEmployerId?.companyPhoneNumber,
        websiteUrl: user?.ownerEmployerId?.websiteUrl,
        companyIndustry: user?.ownerEmployerId?.companyIndustry,
        companySize: user?.ownerEmployerId?.companySize,
        companyLocation: user?.ownerEmployerId?.companyLocation,
        companyDescription: user?.ownerEmployerId?.companyDescription,
      });
    }
  }, [user?.ownerEmployerId, reset]);

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
                  imgUrlPreview={user?.ownerEmployerId?.companyLogo}
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
                  defaultValue={user?.ownerEmployerId?.companyIndustry}
                  error={errors?.companyIndustry}
                  options={companyIndustryOptions}
                />
                <SelectController
                  control={control}
                  name="companySize"
                  label="Quy mô công ty"
                  defaultValue={user?.ownerEmployerId?.companySize}
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
