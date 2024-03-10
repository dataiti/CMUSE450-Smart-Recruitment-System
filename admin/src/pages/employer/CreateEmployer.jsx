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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { icons } from "../../utils/icons";
import {
  companyIndustryOptions,
  companySizesOptions,
} from "../../utils/constants";
import {
  InputFileController,
  TextEditorController,
  SelectController,
  InputController,
} from "../../components/forms";
import { Loading } from "../../components/shares";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterEmployerForAdminMutation } from "../../redux/features/apis/employerApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { toast } from "react-toastify";
import { addEmployer } from "../../redux/features/slices/employerSlice";
import { useWorkLocations } from "../../hooks";

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

const CreateEmployer = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [registerEmployerForAdmin, { isLoading }] =
    useRegisterEmployerForAdminMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
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

  const provinceWatch = watch("province");
  const districtWatch = watch("district");

  useEffect(() => {
    dispatch(setTitle("Đăng ký nhà tuyển dụng"));
  }, [dispatch]);

  const { provincesValue, districtsValue, wardsValue } = useWorkLocations(
    provinceWatch,
    districtWatch
  );

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

      const response = await registerEmployerForAdmin({
        formData,
        userId: user._id,
      });
      if (response && response.data && response.data.success) {
        dispatch(addEmployer({ data: response.data.data }));
        toast.success("Đăng ký nhà tuyển dụng thành công");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {isLoading && <Loading />}
      <div className="p-5 rounded-md shadow-sm bg-white ">
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
                  Đăng ký tài khoản
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputController
                    control={control}
                    name="lastName"
                    label="Họ"
                    error={errors?.companyName}
                  />
                  <InputController
                    control={control}
                    name="firstName"
                    label="Tên"
                    error={errors?.companyEmail}
                  />
                  <InputController
                    control={control}
                    name="email"
                    label="Email"
                    error={errors?.companyPhoneNumber}
                  />
                  <InputController
                    control={control}
                    name="password"
                    label="Mật khẩu"
                    error={errors?.websiteUrl}
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

export default CreateEmployer;
