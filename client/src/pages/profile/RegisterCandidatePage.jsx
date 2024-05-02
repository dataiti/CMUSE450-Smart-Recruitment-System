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
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { jobPositionOptions } from "../../utils/constants";
import { Link } from "react-router-dom";
import {
  useCreateCandidateMutation,
  useEditCandidateMutation,
} from "../../redux/features/apis/candidateApi";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelect,
  updateCandidate,
} from "../../redux/features/slices/authSlice";
import { toast } from "react-toastify";
import {
  InputController,
  TextareaController,
  SelectController,
  InputPDFController,
  InputTagsController,
} from "../../components/forms";
import {
  ButtonCustom,
  IconButtonCustom,
  Loading,
} from "../../components/shares";
import { useWorkLocations } from "../../hooks";

const schema = yup.object().shape({
  jobPosition: yup.string().required("Vui lòng nhập vị trí công việc"),
  workLocation: yup.string().required("Vui lòng nhập địa điểm làm việc"),
  desiredSalary: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương")
    .required("Vui lòng nhập mức lương mong muốn"),
});

const RegisterCandidatePage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [namePDFFile, setNamePDFFile] = useState("");

  const { provincesValue } = useWorkLocations();

  const [createCandidate, { isLoading: isLoadingCreate }] =
    useCreateCandidateMutation();
  const [editCandidate, { isLoading: isLoadingEdit }] =
    useEditCandidateMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      CVpdf: "",
      jobPosition: "",
      workLocation: "",
      desiredSalary: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user?.candidateId) {
      reset({
        CVpdf: user?.candidateId?.CVpdf,
        jobPosition: user?.candidateId?.jobPosition,
        workLocation: user?.candidateId?.workLocation,
        desiredSalary: user?.candidateId?.desiredSalary,
        experience: user?.candidateId?.experience,
        skills: user?.candidateId?.skills,
      });
      setNamePDFFile(user?.candidateId?.CVName);
    }
  }, [reset, user?.candidateId]);

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

      let formData = new FormData();
      for (const key in formatData) {
        if (formatData.hasOwnProperty(key)) {
          formData.append(key, formatData[key]);
        }
      }

      let response;

      if (user?.candidateId?._id) {
        response = await editCandidate({
          data: formData,
          userId: user?._id,
          candidateId: user?.candidateId?._id,
        });
        if (response?.data?.success) {
          dispatch(updateCandidate({ data: response?.data?.data }));
          toast.success("Cập nhật ứng viên thành công");
        }
      } else {
        response = await createCandidate({
          data: formData,
          userId: user?._id,
        });
        if (response?.data?.success)
          dispatch(updateCandidate({ data: response?.data?.data }));
        toast.success("Đăng ký ứng viên thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {(isLoadingCreate || isLoadingEdit) && <Loading />}
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
              <div className="flex flex-col gap-6">
                <SelectController
                  control={control}
                  name="jobPosition"
                  label="Vị trí muốn ứng tuyển"
                  defaultValue={user?.candidateId?.jobPosition}
                  error={errors?.jobPosition}
                  options={jobPositionOptions}
                />
                <SelectController
                  control={control}
                  name="workLocation"
                  label="Địa điểm làm việc"
                  defaultValue={user?.candidateId?.workLocation}
                  error={errors?.workLocation}
                  options={provincesValue}
                />
                <InputController
                  control={control}
                  name="desiredSalary"
                  defaultValue={user?.candidateId?.desiredSalary}
                  label="Mức lương mong muốn"
                  error={errors?.desiredSalary}
                />
                <InputPDFController
                  control={control}
                  name="CVpdf"
                  namePDFFile={namePDFFile}
                  setNamePDFFile={setNamePDFFile}
                />
                {user?.candidateId && (
                  <InputController
                    control={control}
                    name="experience"
                    label="Kinh nghiệm"
                    defaultValue={user?.candidateId?.experience}
                  />
                )}
                {user?.candidateId?.skills && (
                  <InputTagsController
                    control={control}
                    name="skills"
                    label="Kỹ năng"
                    defaultTags={user?.candidateId?.skills}
                  />
                )}

                {/* {user?.candidateId?.skills && (
                  <div className="flex flex-col relative ml-10 w-full">
                    <div className="grid grid-cols-4">
                      <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
                        Kỹ năng:{" "}
                      </label>
                      <div className="col-span-2 w-full flex items-center gap-1 flex-wrap">
                        {user?.candidateId?.skills.map((skill, index) => (
                          <div
                            className="text-blue-700 bg-blue-50 name flex whitespace-nowrap items-center gap-2 px-4 py-2 rounded-md border border-blue-500"
                            key={index}
                          >
                            <Typography className="text-xs font-bold">
                              {skill}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )} */}
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
                {user?.candidateId ? "Cập nhật" : "Đăng ký ứng viên"}
              </ButtonCustom>
            </TimelineHeader>
          </TimelineItem>
        </Timeline>
      </form>
    </div>
  );
};

export default RegisterCandidatePage;
