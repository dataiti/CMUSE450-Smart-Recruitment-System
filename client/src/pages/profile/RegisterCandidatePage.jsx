import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Typography,
} from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputController from "../../components/InputController";
import SelectController from "../../components/SelectController";
import TextareaController from "../../components/TextareaController";
import RadioController from "../../components/RadioController";
import { desiredSalarys, experiens } from "../../utils/constants";
import axiosClient from "../../configs/axiosConfig";
import IconButtonCustom from "../../components/IconButtonCustom";
import ButtonCustom from "../../components/ButtonCustom";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Mật khẩu không được bỏ trống"),
  newPassword: yup.string().required("Mật khẩu không được bỏ trống"),
  confirmNewPassword: yup.string().required("Mật khẩu không được bỏ trống"),
});

const RegisterCandidatePage = () => {
  const [workLocationsValue, setWorkLocationsValue] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      yearOfBirth: "",
      sex: 1,
      experience: "",
      careers: "",
      workLocation: "",
      desiredSalary: "",
      yourCV: "",
      skills: "",
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
            <Typography variant="h5" className="text-teal-800 font-bold">
              Thông tin làm việc cơ bản
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-8 flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <InputController
                control={control}
                name="fullName"
                label="Họ và tên"
                error={errors?.fullName}
              />
              <InputController
                control={control}
                name="yearOfBirth"
                label="Năm sinh"
                error={errors?.yearOfBirth}
              />

              <RadioController
                control={control}
                name="sex"
                label="Giới tính"
                values={[
                  { value: 1, label: "Nam" },
                  { value: 2, label: "Nữ" },
                  { value: 3, label: "Không xác định" },
                ]}
                error={errors?.sex}
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
                name="careers"
                label="Chuyên ngành"
                error={errors?.careers}
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
              <InputController
                control={control}
                name="yourCV"
                label="CV chính của bạn"
                error={errors?.yourCV}
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
            <Typography variant="h5" color="blue-gray">
              Thông tin thêm (không bắt buộc)
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-8 flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <SelectController
                control={control}
                name="skills"
                label="Kỹ năng"
                error={errors?.skills}
              />
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
            <Typography variant="h5" color="blue-gray">
              Hoàn thành
            </Typography>
            <div className="flex items-center justify-center">
              <ButtonCustom>Đăng ký ứng viên</ButtonCustom>
            </div>
          </TimelineHeader>
        </TimelineItem>
      </Timeline>
    </form>
  );
};

export default RegisterCandidatePage;
