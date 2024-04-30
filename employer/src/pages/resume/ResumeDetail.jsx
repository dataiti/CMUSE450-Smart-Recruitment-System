import React from "react";
import { useParams } from "react-router-dom";
import { useGetApplyJobDetailQuery } from "../../redux/features/apis/apply";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { Loading, PDFViewer } from "../../components/shares";

const ResumeDetail = () => {
  const { applyJobId } = useParams();

  const { user } = useSelector(authSelect);

  const { data: applyJobDetailData, isFetching } = useGetApplyJobDetailQuery(
    {
      userId: user?._id,
      employerId: user?.ownerEmployerId?._id,
      applyId: applyJobId,
    },
    { skip: !user || !user.ownerEmployerId._id }
  );

  return (
    <div className="w-full h-full">
      {isFetching && <Loading />}
      <div className="h-[calc(100vh-60px)]">
        <PDFViewer url={applyJobDetailData?.data?.CVpdf} />
      </div>
    </div>
  );
};

export default ResumeDetail;
