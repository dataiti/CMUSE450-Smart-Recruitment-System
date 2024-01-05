import {
  Avatar,
  Breadcrumbs,
  Input,
  Typography,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetListApplyJobForCandidateQuery } from "../../redux/features/apis/applyJobApi";
import { useDebounce } from "../../hooks";
import { authSelect } from "../../redux/features/slices/authSlice";
import { useSelector } from "react-redux";
import { statusOptions, tableHeadApplyJob } from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import {
  SelectCustom,
  Pagination,
  Loading,
  JobStatusBadge,
  ButtonCustom,
  DrawerCustom,
  JobDetailDrawer,
  Modal,
} from "../../components/shares";
import { useCallback } from "react";
import { FeedbackForm } from "../../components/forms";

const ListMyApplyJobs = () => {
  const { user } = useSelector(authSelect);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(7);
  const [page, setPage] = useState(1);
  const [statusSelected, setStatusSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenFeedbackModal, setIsOpenFeedbackModal] = useState(false);
  const [jobDetailData, setJobDetailData] = useState({});

  const debouncedValue = useDebounce(search, 500);

  const { data: listApplyJobsData, isFetching } =
    useGetListApplyJobForCandidateQuery(
      {
        userId: user?._id,
        search: debouncedValue,
        page,
        limit,
        status: "",
      },
      { refetchOnMountOrArgChange: true }
    );

  const openDrawer = () => setIsOpenDrawer(true);
  const closeDrawer = () => setIsOpenDrawer(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSelectedStatus = (e) => {
    setStatusSelected(e);
  };

  const handleViewApplyJobDetail = useCallback(
    ({ _id }) => {
      openDrawer();
      setJobDetailData(listApplyJobsData.data.find((job) => job._id === _id));
    },
    [listApplyJobsData?.data]
  );

  return (
    <div className="w-full flex flex-col gap-2">
      {isFetching && <Loading />}
      <Breadcrumbs fullWidth className="!bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/manage-jobapply" className="font-bold text-sm">
          Quản lý ứng tuyển của tôi
        </Link>
      </Breadcrumbs>
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4">
            <Input
              label="Tìm kiếm vị trí tuyển dụng"
              value={search}
              onChange={handleChangeSearch}
            />
          </div>
          <div className="col-span-2">
            <SelectCustom
              label="Trạng thái"
              options={statusOptions}
              value={statusSelected}
              onChange={handleSelectedStatus}
            />
          </div>
        </div>
        <div className="">
          <table className="w-full text-sm font-bold text-left cursor-pointer border border-blue-gray-100 !rounded-md">
            <thead className="text-xs  text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
              <tr>
                {tableHeadApplyJob.map(({ id, name }) => {
                  return (
                    <th
                      key={id}
                      scope="col"
                      className="px-6 py-3 text-xs text-center"
                    >
                      {name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {listApplyJobsData?.data?.length > 0 &&
                listApplyJobsData?.data?.map((job, index) => {
                  return (
                    <tr
                      className="bg-white border-b border-blue-gray-100 hover:bg-gray-100 "
                      key={job?._id || index}
                    >
                      <td className="px-3 text-xs font-bold py-1 text-blue-gray-800">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={job?.employerId?.companyLogo}
                            alt="avatar"
                            className="h-12 w-12 p-1 bg-blue-gray-100 flex-none"
                          />
                          <div className="flex flex-col">
                            <Typography className="text-xs font-bold">
                              {job?.employerId?.companyName}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800 name-3">
                        {job?.jobId?.recruitmentTitle}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        <Link
                          to={job?.CVpdf}
                          target="_blank"
                          className="text-blue-500 text-xs hover:underline name"
                        >
                          {job?.CVName?.slice(0, 20)}
                        </Link>
                      </td>
                      <td className="py-1 text-center text-blue-gray-800">
                        <JobStatusBadge status={job?.status} />
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        {covertToDate(job?.createdAt)}
                      </td>
                      <td className="px-1 text-xs flex gap-1 font-bold py-1 text-blue-gray-800">
                        <ButtonCustom
                          isDisabled={
                            job?.status === "interviewed" ? false : true
                          }
                          className="whitespace-nowrap text-xs capitalize font-bold rounded-full !p-3  bg-blue-50 text-blue-500 hover:bg-blue-100"
                          onClick={() => setIsOpenFeedbackModal(true)}
                        >
                          Đánh giá
                        </ButtonCustom>
                        <ButtonCustom
                          className="whitespace-nowrap text-xs capitalize font-bold rounded-full !p-3  bg-blue-50 text-blue-500 hover:bg-blue-100"
                          onClick={() =>
                            handleViewApplyJobDetail({ _id: job?._id })
                          }
                        >
                          Chi tiết
                        </ButtonCustom>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Pagination
          totalPage={5}
          handlePageChange={handlePageChange}
          page={page}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
      <DrawerCustom
        open={isOpenDrawer}
        setOpen={setIsOpenDrawer}
        closeDrawer={closeDrawer}
      >
        <JobDetailDrawer jobDetailData={jobDetailData?.jobId} />
      </DrawerCustom>
      <Modal
        open={isOpenFeedbackModal}
        handleOpen={setIsOpenFeedbackModal}
        size="xs"
      >
        <FeedbackForm />
      </Modal>
    </div>
  );
};

export default ListMyApplyJobs;
