import React from "react";
import { DialogBody, DialogHeader, Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { CirculeProgress, ProgressCustom, SkillTags } from "../shares";
import { useGetEvaluateSuitableCandidateQuery } from "../../redux/features/apis/analyticApi";

const EvaluateSuitableCandidate = ({
  setOpen = () => {},
  data = {},
  userId,
  employerId,
  candidateId,
  workPositionRequireId,
}) => {
  const { data: getEvaluateSuitableCandidateData } =
    useGetEvaluateSuitableCandidateQuery({
      userId,
      employerId,
      candidateId,
      workPositionRequireId,
    });

  return (
    <div className="h-full rounded-md !text-black bg-blue-gray-900">
      <DialogHeader>
        <div className="flex items-center justify-between w-full">
          <Typography className="uppercase text-sm font-bold text-light-blue-600">
            Đánh giá mức độ phù hợp công việc
          </Typography>
          <span
            className="text-teal-600 hover:opacity-90 cursor-pointer transition-all"
            onClick={() => setOpen(false)}
          >
            <icons.AiFillCloseCircle size={30} />
          </span>
        </div>
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 justify-between border border-gray-100 rounded-md flex-1 p-2">
                    <Typography className="text-center text-sm font-bold text-light-blue-600">
                      Đánh giá mức độ phù hợp
                    </Typography>
                    <div className="flex items-center justify-center">
                      <CirculeProgress
                        percentage={
                          getEvaluateSuitableCandidateData?.data
                            ?.overallPercentage
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 justify-between border border-gray-100 rounded-md flex-1 p-2">
                    <Typography className="text-center text-sm font-bold text-light-blue-600">
                      Độ lệch chuẩn
                    </Typography>
                    <div className="flex items-center justify-center">
                      <Typography className="border-[8px] border-light-blue-500 flex items-center justify-center h-[60px] w-[60px] bg-light-blue-50 text-light-blue-500 font-bold rounded-full text-lg">
                        {
                          getEvaluateSuitableCandidateData?.data
                            ?.standardDeviation
                        }
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-4 border border-gray-100 rounded-md">
                  {getEvaluateSuitableCandidateData?.data?.percentages?.map(
                    (percentage, index) => {
                      return (
                        <ProgressCustom
                          key={index}
                          label={percentage?.title}
                          value={percentage?.value}
                        />
                      );
                    }
                  )}
                </div>
              </div>
              <div className="h-[230px] overflow-y-auto p-5 border border-gray-100 rounded-md">
                <SkillTags
                  data={getEvaluateSuitableCandidateData?.data?.candidateSkills}
                  title="Kỹ năng của ứng viên"
                  className="text-blue-500 bg-blue-50"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SkillTags
              data={getEvaluateSuitableCandidateData?.data?.skillMatch}
              title="Kỹ năng bạn phù hợp"
              className="text-green-500 bg-indigo-50"
            />
            <SkillTags
              data={getEvaluateSuitableCandidateData?.data?.skillNotMatch}
              title="Kỹ năng bạn còn thiếu"
              className="text-red-500 bg-indigo-50"
            />
          </div>
        </div>
      </DialogBody>
    </div>
  );
};

export default EvaluateSuitableCandidate;
