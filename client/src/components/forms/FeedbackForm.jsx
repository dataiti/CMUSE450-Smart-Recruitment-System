import React from "react";
import { Typography, Rating, Textarea } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { ButtonCustom } from "../shares";
import { icons } from "../../utils/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const feedbackSchema = yup.object().shape({
  rating: yup
    .number()
    .typeError("Lương phải là số")
    .positive("Lương phải là số dương")
    .required("Vui lòng chọn lượt sao")
    .min(1, "Lượt sao tối thiểu là 1")
    .max(5, "Lượt sao tối đa là 5"),
  feedbackText: yup.string().required("Nội dung đánh giá không được để trống"),
});

const FeedbackForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      rating: 0,
      feedbackText: "",
    },
    resolver: yupResolver(feedbackSchema),
  });

  const handleSubmitFeedback = async (data) => {
    try {
      console.log(data);
    } catch (error) {}
  };

  return (
    <div className="p-10">
      <Typography className="font-extrabold text-xl text-center uppercase text-black">
        Đánh giá
      </Typography>
      <Typography className="font-semibold text-xs">
        Phản hồi công việc là một phần quan trọng trong quá trình tuyển dụng và
        quản lý nhân sự. Nó cung cấp cơ hội cho ứng viên và nhân viên để chia sẻ
        ý kiến, đánh giá về trải nghiệm làm việc và góp ý để cải thiện môi
        trường làm việc.
      </Typography>
      <form
        onSubmit={handleSubmit(handleSubmitFeedback)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="font-bold whitespace-no-wrap text-teal-800">
            Lượt sao
          </label>
          <Controller
            name="rating"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <div className="flex flex-col gap-2 relative">
                <Rating {...field} />
                {!!errors?.rating && (
                  <Typography
                    color="red"
                    className="absolute -bottom-4 text-xs font-medium"
                  >
                    {errors?.rating?.message}
                  </Typography>
                )}
              </div>
            )}
          />
        </div>
        <Controller
          name="feedbackText"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1 relative">
              <label className="col-span-1 text-base font-bold whitespace-no-wrap text-teal-800">
                Nội dung đánh giá
              </label>
              <div className="col-span-2 w-full">
                <Textarea
                  label="Nội dung đánh giá"
                  {...field}
                  error={!!errors?.feedbackText}
                  color="blue"
                />
                {!!errors?.feedbackText && (
                  <Typography
                    color="red"
                    className="absolute -bottom-3 text-xs font-medium"
                  >
                    {errors?.feedbackText?.message}
                  </Typography>
                )}
              </div>
            </div>
          )}
        />
        <ButtonCustom type="submit" className="w-full">
          <icons.IoMdSend />
          Gửi đánh giá
        </ButtonCustom>
      </form>
    </div>
  );
};

export default FeedbackForm;
