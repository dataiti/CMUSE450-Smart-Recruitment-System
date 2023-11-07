import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
  Breadcrumbs,
} from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectController from "../../components/SelectController";
import TextareaController from "../../components/TextareaController";
import {
  desiredSalarys,
  experiens,
  jobPositionOptions,
} from "../../utils/constants";
import axiosClient from "../../configs/axiosConfig";
import IconButtonCustom from "../../components/IconButtonCustom";
import ButtonCustom from "../../components/ButtonCustom";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import InputTagsController from "../../components/InputTagsController";
import { useCreateCandidateMutation } from "../../redux/features/apis/candidateApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  jobPosition: yup.string().required("Vui lòng nhập vị trí công việc"),
  experience: yup.string().required("Vui lòng chọn trình độ kinh nghiệm"),
  workLocation: yup.string().required("Vui lòng nhập địa điểm làm việc"),
  desiredSalary: yup.string().required("Vui lòng nhập mức lương mong muốn"),
});

const RegisterCandidatePage = () => {
  const { user } = useSelector(authSelect);

  const [workLocationsValue, setWorkLocationsValue] = useState([]);

  const [createCandidate, { isLoading }] = useCreateCandidateMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      jobPosition: "",
      experience: "",
      workLocation: "",
      desiredSalary: "",
      skills: [],
      yourWishes: "",
      introduceYourself: "",
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

  const handleSubmitRegisterCandidate = async (data) => {
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
      console.log(formatData);

      const response = await createCandidate({
        data: formatData,
        userId: user?._id,
      });

      console.log(response);
      if (response && response.data && response.data.success) {
        toast.success("Đăng ký ứng cử viên thành công !");
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isLoading && <Loading />}
      <Breadcrumbs fullWidth className="!bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/categorycategories-job" className="font-bold text-sm">
          Đăng ký ứng cử viên
        </Link>
      </Breadcrumbs>
      <form
        className="bg-white p-4 rounded-md w-full shadow-md"
        onSubmit={handleSubmit(handleSubmitRegisterCandidate)}
      >
        <Timeline>
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="!p-0">
                <IconButtonCustom>
                  <icons.IoBriefcase />
                </IconButtonCustom>
              </TimelineIcon>
              <Typography className="text-light-blue-600 font-bold text-lg">
                Thông tin làm việc cơ bản
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8 flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <SelectController
                  control={control}
                  name="jobPosition"
                  label="Vị trí công việc"
                  error={errors?.jobPosition}
                  options={jobPositionOptions}
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
                  name="workLocation"
                  label="Địa điểm làm việc"
                  error={errors?.workLocation}
                  options={workLocationsValue}
                />
                <SelectController
                  control={control}
                  name="desiredSalary"
                  label="Mức lương mong muốn"
                  error={errors?.desiredSalary}
                  options={desiredSalarys}
                />
                <InputTagsController
                  control={control}
                  name="skills"
                  label="Kỹ năng"
                  error={errors?.skills}
                />
              </div>
            </TimelineBody>
          </TimelineItem>
          <TimelineItem>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon className="!p-0">
                <IconButtonCustom>
                  <icons.IoAddCircle />
                </IconButtonCustom>
              </TimelineIcon>
              <Typography className="text-light-blue-600 font-bold text-lg">
                Thông tin thêm (không bắt buộc)
              </Typography>
            </TimelineHeader>
            <TimelineBody className="pb-8 flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <TextareaController
                  control={control}
                  name="yourWishes"
                  label="Mong muốn của bạn"
                  error={errors?.yourWishes}
                />
                <TextareaController
                  control={control}
                  name="introduceYourself"
                  label="Giới thiệu về bạn"
                  error={errors?.introduceYourself}
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
              <Typography className="text-light-blue-600 font-bold text-lg">
                Hoàn thành
              </Typography>
              <ButtonCustom type="submit" className="ml-20">
                Đăng ký ứng viên
              </ButtonCustom>
            </TimelineHeader>
          </TimelineItem>
        </Timeline>
      </form>
    </div>
  );
};

export default RegisterCandidatePage;
