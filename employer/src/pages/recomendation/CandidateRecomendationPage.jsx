import React, { useState } from "react";
import {
  ButtonCustom,
  CandidateCard,
  Loading,
  Modal,
  SettingWorkPosition,
} from "../../components/shares";
import { Typography } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import { useSuggestedCandidatesQuery } from "../../redux/features/apis/candidateApi";
import { useSelector, useDispatch } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useDeleteWorkPositionRequiredbuilderMutation } from "../../redux/features/apis/workPositionRequireApi";
import { setTitle } from "../../redux/features/slices/titleSlice";

const CandidateRecomendationPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(authSelect);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [listCandidates, setListCandidates] = useState([]);

  const [deleteWorkPositionRequiredbuilder, { isLoading: isDeleteLoading }] =
    useDeleteWorkPositionRequiredbuilderMutation();
  const { data: listCandidatesData, isFetching } = useSuggestedCandidatesQuery(
    {
      userId: user?._id,
      employerId: user?.ownerEmployerId?._id,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    dispatch(setTitle("Gợi ý ứng viên theo vị trí"));
  }, [dispatch]);

  useEffect(() => {
    if (listCandidatesData?.data) {
      setListCandidates(listCandidatesData?.data);
    }
  }, [listCandidatesData]);

  const handleUpdateWorkPositionWeight = async ({ _id }) => {
    setIsOpenModal(true);
  };

  const handleRemoveWorkPositionWeigh = async ({ _id }) => {
    try {
      Swal.fire({
        title: "Bạn có chắc không ?",
        text: "Bạn sẽ không thể hoàn tác điều này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0B5345 ",
        cancelButtonColor: "#A93226",
        confirmButtonText: "Vâng, xoá !",
        cancelButtonText: "Huỷ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteWorkPositionRequiredbuilder({
            userId: user?._id,
            employerId: user?.ownerEmployerId?._id,
            workPositionRequiredId: _id,
          });
          if (response && response.data && response.data.success) {
            setListCandidates(response?.data?.data);
            toast.success("Xoá tin tuyển dụng thành công !");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="m-[10px]">
      {(isFetching || isDeleteLoading) && <Loading />}
      <div className="flex gap-2 flex-nowrap w-[calc(100vw-300px)] overflow-x-auto">
        {listCandidates?.map((candidate, index) => {
          return (
            <div className="flex flex-col gap-2 " key={index}>
              <div className="w-[302px] flex items-center justify-between bg-blue-gray-700 p-3 rounded-full">
                <Typography className="font-bold text-sm text-white whitespace-nowrap">
                  {candidate?.workPosition?.jobPosition} -{" "}
                  {candidate?.workPosition?.milestonePercent} %
                </Typography>
                <div className="flex items-center gap-1">
                  <button
                    className="text-orange-400"
                    onClick={() =>
                      handleUpdateWorkPositionWeight({
                        _id: candidate?.workPosition?._id,
                      })
                    }
                  >
                    <icons.IoAddCircle size={24} />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() =>
                      handleRemoveWorkPositionWeigh({
                        _id: candidate?.workPosition?._id,
                      })
                    }
                  >
                    <icons.IoCloseCircleSharp size={24} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 h-[calc(100vh-180px)] overflow-y-auto">
                {candidate?.listCandidates?.map((candidateItem, index) => {
                  return (
                    <CandidateCard
                      data={candidateItem}
                      key={index}
                      workPositionRequire={candidate?.workPosition}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        <div>
          <ButtonCustom
            onClick={() => setIsOpenModal(true)}
            className="rounded-full bg-green-500 hover:bg-green-400 flex items-center gap-2 text-white whitespace-nowrap"
          >
            <icons.IoAddCircle size={24} />
            Thiết lập Vị trí Mới
          </ButtonCustom>
        </div>
        <Modal open={isOpenModal} handleOpen={setIsOpenModal} size="lg">
          <SettingWorkPosition
            setOpen={setIsOpenModal}
            setListCandidates={setListCandidates}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CandidateRecomendationPage;
