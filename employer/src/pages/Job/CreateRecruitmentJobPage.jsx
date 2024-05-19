import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { icons } from "../../utils/icons";
import {
  useCreateJobMutation,
  useEditJobMutation,
  useGetJobDetailQuery,
} from "../../redux/features/apis/jobApi";
import { format } from "date-fns";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  currencyTypeOptions,
  experiens,
  jobPositionOptions,
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
} from "@material-tailwind/react";
import { addJob, updateJobItem } from "../../redux/features/slices/jobSlice";
import {
  InputTagsController,
  InputController,
  TextEditorController,
  SelectController,
} from "../../components/forms";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { Loading, IconButtonCustom } from "../../components/shares";
import { useGetListOfCategoriesQuery } from "../../redux/features/apis/categoryApi";
import { videos } from "../../assets/videos";
import { useWorkLocations } from "../../hooks";

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

  const location = useLocation();

  const { user } = useSelector(authSelect);

  const [salaryTypeState, SetSalaryTypeState] = useState(1);
  const [jobId, setJobId] = useState("");

  const [createJob, { isLoading: isLoadingCreateJob }] = useCreateJobMutation();
  const { data: listCategoriesData } = useGetListOfCategoriesQuery();
  const { data: jobDetailData, isFetching } = useGetJobDetailQuery(
    { jobId },
    { skip: !jobId, refetchOnMountOrArgChange: true }
  );

  const [editJob, { isLoading: isLoadingEditJob }] = useEditJobMutation();

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
      experience: 0,
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
  const provinceWatch = watch("province");
  const districtWatch = watch("district");

  const { provincesValue, districtsValue, wardsValue } = useWorkLocations(
    provinceWatch,
    districtWatch
  );

  useEffect(() => {
    reset({
      recruitmentCampaignName: jobDetailData?.data?.recruitmentCampaignName,
      jobPosition: jobDetailData?.data?.jobPosition,
      province: jobDetailData?.data?.workRegion?.province || "{}",
      district: jobDetailData?.data?.workRegion?.district || "{}",
      ward: jobDetailData?.data?.workRegion?.ward || "{}",
      exactAddress: jobDetailData?.data?.workRegion?.exactAddress,
      recruitmentTitle: jobDetailData?.data?.recruitmentTitle,
      industry: jobDetailData?.data?.industry,
      vacancyCount: jobDetailData?.data?.vacancyCount,
      jobType: jobDetailData?.data?.jobType,
      gender: jobDetailData?.data?.gender,
      level: jobDetailData?.data?.level,
      experience: jobDetailData?.data?.experience,
      currencyType: jobDetailData?.data?.currencyType,
      salaryType: jobDetailData?.data?.salaryType,
      jobDescription: jobDetailData?.data?.jobDescription,
      skills: jobDetailData?.data?.skills,
      candidateRequirements: jobDetailData?.data?.candidateRequirements,
      candidateBenefits: jobDetailData?.data?.candidateBenefits,
      applicationDeadline:
        jobDetailData?.data?.applicationDeadline &&
        format(
          new Date(jobDetailData?.data?.applicationDeadline),
          "yyyy-MM-dd"
        ),
      receiverFullName: jobDetailData?.data?.receiverFullName,
      receiverEmail: jobDetailData?.data?.receiverEmail,
      receiverPhone: jobDetailData?.data?.receiverPhone,
    });
  }, [jobId, reset, jobDetailData?.data]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get("jobId");

    if (paramValue) setJobId(paramValue);
  }, [location.search]);

  // useEffect(() => {
  //   const parsedSalaryType = salaryType && JSON?.parse(salaryType);
  //   SetSalaryTypeState(
  //     parsedSalaryType?.id >= 1 && parsedSalaryType?.id <= 3
  //       ? parsedSalaryType?.id
  //       : 4
  //   );
  // }, [salaryType]);

  useEffect(() => {
    dispatch(setTitle("Thêm tin tuyển dụng"));
  }, [dispatch]);

  const handleSubmitRegisterEmployer = async (data) => {
    try {
      let formatData = { ...data };

      console.log(formatData);
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
      let response;
      if (jobId) {
        response = await editJob({
          data: formatData,
          userId: user?._id,
          employerId: user?.ownerEmployerId?._id,
          jobId,
          addressId: jobDetailData?.data?.workRegion?._id,
        });
        if (response && response.data && response.data.success) {
          toast.success("Sửa tin tuyển dụng thành công !");
          dispatch(updateJobItem({ data: response.data.data }));
          reset();
        }
      } else {
        response = await createJob({
          data: formatData,
          userId: user?._id,
          employerId: user?.ownerEmployerId?._id,
        });
        if (response && response.data && response.data.success) {
          toast.success("Tạo tin tuyển dụng thành công !");
          dispatch(addJob({ data: response.data.data }));
          reset();
        }
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col gap-2 px-[100px] py-5 w-full">
      {(isLoadingCreateJob || isLoadingEditJob || isFetching) && <Loading />}
      <div className="flex gap-4 w-full p-2 rounded-md bg-gradient-to-r from-[#304352] to-[#cbd5e1]">
        <video className="w-[20%] rounded-lg" autoPlay loop>
          <source src={videos.CVSearching} type="video/mp4" />
        </video>
        <div className="w-[80%]">
          <Typography className="text-white font-bold text-base">
            Chào mừng bạn đến với nền tảng đăng tin của chúng tôi! Để đảm bảo
            rằng thông tin công việc của bạn được truyền đạt một cách chính xác
            và thu hút ứng viên phù hợp, hãy xem xét những lưu ý quan trọng sau
            đây. Chúng tôi tin rằng việc tuân thủ những lưu ý trên sẽ giúp công
            việc của bạn nổi bật và thu hút ứng viên chất lượng. Chúc bạn có một
            trải nghiệm đăng tin hiệu quả!
          </Typography>
        </div>
      </div>
      <form
        className="bg-white py-4 px-10 w-full rounded-md shadow-sm"
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
                Khu vực làm việc
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8 flex flex-col gap-5">
              <div className="flex flex-col gap-6">
                <SelectController
                  control={control}
                  name="province"
                  label="Tỉnh / Thành Phố"
                  defaultValue={jobDetailData?.data?.workRegion?.province}
                  error={errors?.province}
                  options={provincesValue}
                />
                <SelectController
                  control={control}
                  name="district"
                  label="Quận / Huyện"
                  defaultValue={jobDetailData?.data?.workRegion?.district}
                  error={errors?.district}
                  options={districtsValue}
                />
                <SelectController
                  control={control}
                  name="ward"
                  label="Phường / Xã"
                  defaultValue={jobDetailData?.data?.workRegion?.ward}
                  error={errors?.ward}
                  options={wardsValue}
                />
                <InputController
                  control={control}
                  name="exactAddress"
                  defaultValue={jobDetailData?.data?.workRegion?.exactAddress}
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
                Ngành nghề & Lĩnh vực
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8 flex flex-col gap-5">
              <div className="flex flex-col gap-6">
                <SelectController
                  control={control}
                  name="industry"
                  label="Ngành nghề chính"
                  defaultValue={jobDetailData?.data?.industry}
                  error={errors?.industry}
                  options={listCategoriesData?.data}
                />
                <SelectController
                  control={control}
                  name="jobPosition"
                  label="Vị trí tuyển dụng"
                  defaultValue={jobDetailData?.data?.jobPosition}
                  error={errors?.jobPosition}
                  options={jobPositionOptions}
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
                  defaultValue={jobDetailData?.data?.vacancyCount}
                  label="Số lượng tuyển"
                  error={errors?.vacancyCount}
                />
                <SelectController
                  control={control}
                  name="jobType"
                  label="Loại công việc"
                  defaultValue={jobDetailData?.data?.jobType}
                  error={errors?.jobType}
                  options={jobTypeOptions}
                />
                <SelectController
                  control={control}
                  name="gender"
                  label="Giới tính"
                  defaultValue={jobDetailData?.data?.gender}
                  error={errors?.gender}
                  options={sexOptions}
                />
                <SelectController
                  control={control}
                  name="level"
                  label="Cấp bậc"
                  defaultValue={jobDetailData?.data?.level}
                  error={errors?.level}
                  options={levelOptions}
                />
                <SelectController
                  control={control}
                  name="experience"
                  label="Kinh nghiệm"
                  defaultValue={jobDetailData?.data?.experience}
                  error={errors?.experience}
                  options={experiens}
                />
                <SelectController
                  control={control}
                  name="currencyType"
                  label="Loại tiền tệ"
                  defaultValue={jobDetailData?.data?.currencyType}
                  error={errors?.currencyType}
                  options={currencyTypeOptions}
                />
                <SelectController
                  control={control}
                  name="salaryType"
                  label="Kiểu lương"
                  defaultValue={jobDetailData?.data?.salaryType}
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
                  defaultTags={jobDetailData?.data?.skills}
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
    </div>
  );
};

export default CreateRecruitmentJobPage;
