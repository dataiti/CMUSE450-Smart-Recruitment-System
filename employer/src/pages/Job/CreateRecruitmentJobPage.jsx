import React, { useEffect, useState } from "react";
import InputController from "../../components/InputController";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { icons } from "../../utils/icons";
import TextEditorController from "../../components/TextEditorController";
import axiosClient from "../../configs/axiosConfig";
import { useCreateJobMutation } from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import SelectController from "../../components/SelectController";
import {
  companyIndustryOptions,
  currencyTypeOptions,
  experiens,
  jobTypeOptions,
  levelOptions,
  salaryTypeOptions,
  sexOptions,
} from "../../utils/constants";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Button,
  Stepper,
  Step,
} from "@material-tailwind/react";
import { addJob } from "../../redux/features/slices/jobSlice";
import InputTagsController from "../../components/InputTagsController";
import IconButtonCustom from "../../components/IconButtonCustom";
import { setTitle } from "../../redux/features/slices/titleSlice";
import Loading from "../../components/Loading";

const schema = yup.object().shape({
  recruitmentCampaignName: yup
    .string()
    .required("Vui lòng nhập tên chiến dịch tuyển dụng"),
  jobPosition: yup.string().required("Vui lòng nhập vị trí tuyển dụng"),
  province: yup.string().required("Vui lòng nhập tỉnh/thành phố"),
  district: yup.string().required("Vui lòng nhập quận/huyện"),
  ward: yup.string().required("Vui lòng nhập phường/xã"),
  exactAddress: yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
  recruitmentTitle: yup
    .string()
    .required("Vui lòng nhập tiêu đề tin tuyển dụng"),
  industry: yup.string().required("Vui lòng chọn ngành nghề chính"),
  vacancyCount: yup
    .number()
    .typeError("Số lượng tuyển phải là số")
    .positive("Số lượng tuyển phải là số dương")
    .integer("Số lượng tuyển phải là số nguyên")
    .required("Vui lòng nhập số lượng tuyển"),
  jobType: yup.string().required("Vui lòng chọn loại công việc"),
  gender: yup.string().required("Vui lòng chọn giới tính"),
  level: yup.string().required("Vui lòng chọn cấp bậc"),
  experience: yup.string().required("Vui lòng chọn kinh nghiệm"),
  currencyType: yup.string().required("Vui lòng chọn loại tiền tệ"),
  salaryType: yup.string().required("Vui lòng chọn kiểu lương"),
  salaryFrom: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương"),
  salaryTo: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương"),
  jobDescription: yup.string().required("Vui lòng nhập mô tả công việc"),
  candidateRequirements: yup
    .string()
    .required("Vui lòng nhập mô tả yêu cầu ứng viên"),
  candidateBenefits: yup
    .string()
    .required("Vui lòng nhập mô tả quyền lợi ứng viên"),
  applicationDeadline: yup.string().required("Vui lòng nhập hạn chót nhận CV"),
  receiverFullName: yup
    .string()
    .required("Vui lòng nhập họ và tên người nhận CV"),
  receiverEmail: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập địa chỉ email người nhận CV"),
  receiverPhone: yup
    .string()
    .required("Vui lòng nhập số điện thoại người nhận CV"),
});

const CreateRecruitmentJobPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [createJob, { isLoading }] = useCreateJobMutation();

  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [salaryTypeState, SetSalaryTypeState] = useState(1);
  const [provincesValue, setProvincesValue] = useState([]);
  const [districtsValue, setDistrictsValue] = useState([]);
  const [wardsValue, setWardsValue] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      recruitmentCampaignName: "",
      jobPosition: "",
      province: "",
      district: "",
      ward: "",
      exactAddress: "",
      recruitmentTitle: "",
      industry: "",
      vacancyCount: 0,
      jobType: "",
      gender: "",
      level: "",
      experience: "",
      currencyType: "",
      salaryType: "",
      jobDescription: "",
      skills: [],
      candidateRequirements: "",
      candidateBenefits: "",
      applicationDeadline: "",
      receiverFullName: "",
      receiverEmail: "",
      receiverPhone: "",
    },
    resolver: yupResolver(schema),
  });

  const salaryType = watch("salaryType");
  const province = watch("province");
  const district = watch("district");

  useEffect(() => {
    const parsedSalaryType = salaryType && JSON.parse(salaryType);
    SetSalaryTypeState(
      parsedSalaryType.id >= 1 && parsedSalaryType.id <= 3
        ? parsedSalaryType.id
        : 4
    );
  }, [salaryType]);

  useEffect(() => {
    dispatch(setTitle("Thêm tin tuyển dụng"));
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

  // const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  // const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const handleSubmitRegisterEmployer = async (data) => {
    try {
      let formatData = { ...data };
      for (const key in formatData) {
        if (formatData.hasOwnProperty(key)) {
          const value = formatData[key];

          if (key === "skills") {
            formatData[key] = JSON.stringify(value);
          } else {
            try {
              const parsedValue = JSON.parse(value);

              if (parsedValue.hasOwnProperty("value")) {
                formatData[key] = parsedValue.value;
              }
            } catch (error) {}
          }
        }
      }
      const response = await createJob({
        data: formatData,
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
      });

      if (response && response.data && response.data.success) {
        toast.success("Tạo tin tuyển dụng thành công !");
        dispatch(addJob({ data: response.data.data }));
        reset();
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-2 px-[100px] py-5 w-full">
      {isLoading && <Loading />}
      <div className="w-full px-10 pt-4 pb-8 rounded-md shadow-sm bg-white">
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
        >
          <Step className="cursor-pointer" onClick={() => setActiveStep(0)}>
            <Typography className="font-bold">1</Typography>
            <div className="absolute left-0 top-[104%] w-max text-center">
              <Typography
                className={`text-sm text-black ${
                  activeStep === 0 ? "font-semibold" : "font-medium"
                }`}
              >
                Nội dung đăng tuyển
              </Typography>
            </div>
          </Step>
          <Step className="cursor-pointer" onClick={() => setActiveStep(1)}>
            <Typography className="font-bold">2</Typography>
            <div className="absolute top-[104%] w-max text-center">
              <Typography
                className={`text-sm text-black ${
                  activeStep === 1 ? "font-semibold" : "font-medium"
                }`}
              >
                Test đầu vào
              </Typography>
            </div>
          </Step>
          <Step className="cursor-pointer" onClick={() => setActiveStep(2)}>
            <Typography className="font-bold">3</Typography>
            <div className="absolute top-[104%] w-max text-center">
              <Typography
                className={`text-sm text-black ${
                  activeStep === 2 ? "font-semibold" : "font-medium"
                }`}
              >
                Hoàn tất
              </Typography>
            </div>
          </Step>
        </Stepper>
      </div>
      {activeStep === 0 && (
        <form
          className="bg-white py-4   px-10 w-full rounded-md shadow-sm"
          onSubmit={handleSubmit(handleSubmitRegisterEmployer)}
        >
          <Timeline>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Thông tin chiến dịch
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputController
                    control={control}
                    name="recruitmentCampaignName"
                    label="Tên chiến dịch tuyển dụng"
                    error={errors?.recruitmentCampaignName}
                  />
                  <InputController
                    control={control}
                    name="jobPosition"
                    label="Vị trí tuyển dụng"
                    error={errors?.jobPosition}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Khu vực làm việc
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
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
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Tiêu đề tin tuyển dụng
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputController
                    control={control}
                    name="recruitmentTitle"
                    label="Tiêu đề tin"
                    error={errors?.recruitmentTitle}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Ngành nghề & Lĩnh vực
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <SelectController
                    control={control}
                    name="industry"
                    label="Ngành nghề chính"
                    error={errors?.industry}
                    options={companyIndustryOptions}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Thông tin chung
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputController
                    type="number"
                    control={control}
                    name="vacancyCount"
                    label="Số lượng tuyển"
                    error={errors?.vacancyCount}
                  />
                  <SelectController
                    control={control}
                    name="jobType"
                    label="Loại công việc"
                    error={errors?.jobType}
                    options={jobTypeOptions}
                  />
                  <SelectController
                    control={control}
                    name="gender"
                    label="Giới tính"
                    error={errors?.gender}
                    options={sexOptions}
                  />
                  <SelectController
                    control={control}
                    name="level"
                    label="Cấp bậc"
                    error={errors?.level}
                    options={levelOptions}
                  />
                  <SelectController
                    control={control}
                    name="experience"
                    label="Kinh nghiệm"
                    error={errors?.experience}
                    options={experiens}
                  />
                  <SelectController
                    control={control}
                    name="currencyType"
                    label="Loại tiền tệ"
                    error={errors?.currencyType}
                    options={currencyTypeOptions}
                  />
                  <SelectController
                    control={control}
                    name="salaryType"
                    label="Kiểu lương"
                    error={errors?.salaryType}
                    options={salaryTypeOptions}
                  />
                  {salaryTypeState === 1 && (
                    <>
                      <InputController
                        type="number"
                        control={control}
                        name="salaryFrom"
                        label="Từ"
                        error={errors?.salaryFrom}
                      />
                      <InputController
                        type="number"
                        control={control}
                        name="salaryTo"
                        label="Đến"
                        error={errors?.salaryTo}
                      />
                    </>
                  )}
                  {salaryTypeState === 2 && (
                    <InputController
                      control={control}
                      name="salaryFrom"
                      label="Từ"
                      error={errors?.salaryFrom}
                    />
                  )}
                  {salaryTypeState === 3 && (
                    <InputController
                      control={control}
                      name="salaryTo"
                      label="Đến"
                      error={errors?.salaryTo}
                    />
                  )}
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Nội dung tuyển chi tiết
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <TextEditorController
                    control={control}
                    name="jobDescription"
                    label="Mô tả công việc"
                    error={errors?.jobDescription}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Yêu cầu ứng viên
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <TextEditorController
                    control={control}
                    name="candidateRequirements"
                    label="Mô tả yêu cầu ứng viên"
                    error={errors?.candidateRequirements}
                  />
                  <InputTagsController
                    control={control}
                    name="skills"
                    label="Kỹ năng"
                    error={errors?.candidateRequirements}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Quyền lợi ứng viên
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <TextEditorController
                    control={control}
                    name="candidateBenefits"
                    label="Mô tả quyền lợi ứng viên"
                    error={errors?.candidateBenefits}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Thông tin nhận CV
                </Typography>
              </TimelineHeader>
              <TimelineBody className="pb-8 flex flex-col gap-5">
                <div className="flex flex-col gap-6">
                  <InputController
                    type="date"
                    control={control}
                    name="applicationDeadline"
                    label="Hạn chót nhận CV"
                    error={errors?.applicationDeadline}
                  />
                  <InputController
                    control={control}
                    name="receiverFullName"
                    label="Họ và tên"
                    error={errors?.receiverFullName}
                  />
                  <InputController
                    control={control}
                    name="receiverEmail"
                    label="Email"
                    error={errors?.receiverEmail}
                  />
                  <InputController
                    control={control}
                    name="receiverPhone"
                    label="Số điện thoại"
                    error={errors?.receiverPhone}
                  />
                </div>
              </TimelineBody>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineIcon className="!p-0">
                  <IconButtonCustom>
                    <icons.BsCheckCircleFill />
                  </IconButtonCustom>
                </TimelineIcon>
                <Typography
                  variant="h5"
                  className="text-base font-bold text-light-blue-600 uppercase"
                >
                  Hoàn thành
                </Typography>
                <div className="ml-[100px] flex items-center justify-center">
                  <Button type="submit">Tiếp tục</Button>
                </div>
              </TimelineHeader>
            </TimelineItem>
          </Timeline>
        </form>
      )}
    </div>
  );
};

export default CreateRecruitmentJobPage;
