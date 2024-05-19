import React from "react";
import { Typography } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  InputController,
  InputTagsController,
  SelectController,
} from "../forms";
import { jobPositionOptions } from "../../utils/constants";
import { useCreateWorkPositionRequiredMutation } from "../../redux/features/apis/workPositionRequireApi";
import { Loading, ButtonCustom } from "../shares";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  titlePosition: yup
    .string()
    .required("Vui lòng nhập  tiêu đề vị trí công việc"),
  jobPosition: yup.string().required("Vui lòng nhập vị trí công việc"),
  experienceWeight: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương")
    .min(0, "Trọng số kinh nghiệm không thể nhỏ hơn 0")
    .max(1, "Trọng số kinh nghiệm không thể lớn hơn 1")
    .required("Vui lòng nhập trọng số kinh nghiệm"),
  skillsWeight: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương")
    .min(0, "Trọng số kinh nghiệm không thể nhỏ hơn 0")
    .max(1, "Trọng số kinh nghiệm không thể lớn hơn 1")
    .required("Vui lòng nhập trọng số kỹ năng"),
  // skillsRequire: yup.string().required("Vui lòng nhập yêu cầu kỹ năng"),
  experienceRequire: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương")
    .required("Vui lòng nhập yêu cầu kinh nghiệm"),
  milestonePercent: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương")
    .min(0, "Phần trăm cột mốc không thể nhỏ hơn 0")
    .max(100, "Phần trăm cột mốc không thể lớn hơn 100")
    .required("Vui lòng nhập phần trăm cột mốc"),
});

const SettingWorkPosition = ({ setOpen, setListCandidates, workPosition }) => {
  const { user } = useSelector(authSelect);

  const [createWorkPositionRequired, { isLoading }] =
    useCreateWorkPositionRequiredMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      titlePosition: "",
      jobPosition: "",
      experienceWeight: "",
      skillsWeight: "",
      skillsRequire: "",
      experienceRequire: "",
      milestonePercent: "",
    },
    resolver: yupResolver(schema),
  });

  const handleSetupWorkPositionRequire = async (data) => {
    try {
      let formatData = { ...data };
      for (const key in formatData) {
        if (formatData.hasOwnProperty(key)) {
          const value = formatData[key];

          if (key === "skillsRequire") {
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

      const response = await createWorkPositionRequired({
        data: formatData,
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
      });
      if (response && response.data && response.data.success) {
        setListCandidates(response?.data?.data);
        toast.success("Thiết lập thống số vị trí thành công !");
        setOpen(false);
        reset({
          jobPosition: "",
          experienceWeight: "",
          skillsWeight: "",
          skillsRequire: "",
          experienceRequire: "",
          milestonePercent: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-4">
      {isLoading && <Loading />}
      <Typography className="text-center text-xl font-bold text-black">
        Thiết lập thống số vị trí ứng tuyển
      </Typography>
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleSetupWorkPositionRequire)}
      >
        <InputController
          control={control}
          name="titlePosition"
          label="Tiêu đề vị trí tuyển"
          error={errors?.titlePosition}
        />
        <SelectController
          control={control}
          name="jobPosition"
          label="Vị trí tuyển dụng"
          defaultValue={workPosition?.jobPosition}
          error={errors?.jobPosition}
          options={jobPositionOptions}
        />
        <InputController
          control={control}
          name="experienceWeight"
          label="Trọng số kinh nghiệm"
          error={errors?.experienceWeight}
        />
        <InputController
          control={control}
          name="skillsWeight"
          label="Trọng số kỹ năng"
          error={errors?.skillsWeight}
        />
        <InputController
          control={control}
          name="experienceRequire"
          label="Kinh nghiệm"
          error={errors?.experienceRequire}
        />
        <InputTagsController
          control={control}
          name="skillsRequire"
          label="Kỹ năng"
          error={errors?.skillsRequire}
        />
        <InputController
          control={control}
          name="milestonePercent"
          label="Cột mốc lấy (%)"
          error={errors?.milestonePercent}
        />
        <div className="flex justify-center">
          <ButtonCustom type="submit">Thiết lập</ButtonCustom>
        </div>
      </form>
    </div>
  );
};

export default SettingWorkPosition;
