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
import InputController from "../../components/InputController";
import SelectController from "../../components/SelectController";
import TextareaController from "../../components/TextareaController";
import { desiredSalarys, experiens, sexOptions } from "../../utils/constants";
import axiosClient from "../../configs/axiosConfig";
import IconButtonCustom from "../../components/IconButtonCustom";
import ButtonCustom from "../../components/ButtonCustom";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import InputTagsController from "../../components/InputTagsController";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Mật khẩu không được bỏ trống"),
  newPassword: yup.string().required("Mật khẩu không được bỏ trống"),
  confirmNewPassword: yup.string().required("Mật khẩu không được bỏ trống"),
});

const RegisterCandidatePage = () => {
  const [workLocationsValue, setWorkLocationsValue] = useState([]);
  const [namePDFFile, setNamePDFFile] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      yearOfBirth: "",
      sex: "",
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
    <div className="flex flex-col gap-2">
      {/* {isFetching && <Loading />} */}
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
                <SelectController
                  control={control}
                  name="sex"
                  label="Giới tính"
                  error={errors?.sex}
                  options={sexOptions}
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

                <div className="flex flex-col relative ml-10 w-full">
                  <Controller
                    control={control}
                    name="yourCV"
                    render={({ field: { onChange } }) => (
                      <div className="grid grid-cols-4">
                        <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
                          CV chính của bạn
                        </label>
                        <div className="col-span-2 w-full">
                          <label
                            htmlFor="yourCV"
                            className="flex items-center gap-2 border border-gray-400 rounded-md px-4 py-2 w-[220px] cursor-pointer hover:bg-gray-100"
                          >
                            <icons.BsFiletypePdf size={18} />
                            <Typography className="text-sm font-bold">
                              Tải lên CV từ máy tính
                            </Typography>
                          </label>
                          <input
                            type="file"
                            id="yourCV"
                            hidden
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setNamePDFFile(file.name);
                              return onChange(e.target.files[0]);
                            }}
                          />
                          <Typography className="text-sm font-bold">
                            {namePDFFile}
                          </Typography>
                        </div>
                      </div>
                    )}
                  />
                </div>
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
                <InputTagsController
                  control={control}
                  name="skills"
                  label="Kỹ năng"
                  error={errors?.candidateRequirements}
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
              <Typography className="text-light-blue-600 font-bold text-lg">
                Hoàn thành
              </Typography>
              <ButtonCustom className="ml-20">Đăng ký ứng viên</ButtonCustom>
            </TimelineHeader>
          </TimelineItem>
        </Timeline>
      </form>
    </div>
  );
};

export default RegisterCandidatePage;
