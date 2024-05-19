import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  jobSelect,
  removeJobItem,
  setListJobs,
  updateHiringStatusJob,
} from "../../redux/features/slices/jobSlice";
import {
  useDeleteJobMutation,
  useGetListOfJobsForEmployerQuery,
  useToggleHiringStatusJobMutation,
} from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  experiens,
  orderByOptions,
  sortByOptions,
  statusOptions,
  tableHeadJob,
} from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import { Button, Drawer, Input } from "@material-tailwind/react";
import { useDebounce } from "../../hooks";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setTitle } from "../../redux/features/slices/titleSlice";
import {
  Loading,
  SelectCustom,
  SwitchCustom,
  Pagination,
  ButtonCustom,
  JobStatusBadge,
} from "../../components/shares";
import Swal from "sweetalert2";
import { JobDetail } from "../../pages";

const ListJobsPage = () => {
  const dispatch = useDispatch();

  const { listJobs, totalPage } = useSelector(jobSelect);
  const { user } = useSelector(authSelect);

  const [orderBy, setOrderBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const [experienceSelected, setExperienceSelected] = useState("");
  const [statusJobSelected, setStatusJobSelected] = useState("");
  const [jobDetailData, setJobDetailData] = useState({});

  const debouncedValue = useDebounce(search, 500);

  const [open, setOpen] = useState(false);

  const { data: listJobsData, isFetching } = useGetListOfJobsForEmployerQuery(
    {
      userId: user?._id,
      employerId: user?.ownerEmployerId?._id,
      search: debouncedValue,
      sortBy,
      orderBy,
      page,
      limit,
      experience: experienceSelected,
      status: statusJobSelected,
    },
    { skip: !user || !user.ownerEmployerId, refetchOnMountOrArgChange: true }
  );

  const [toggleHiringStatusJob, { isLoading }] =
    useToggleHiringStatusJobMutation();
  const [deleteJob, { isLoading: isLoadingDeleteJob }] = useDeleteJobMutation();

  useEffect(() => {
    if (listJobsData && listJobsData.success) {
      dispatch(
        setListJobs({
          data: listJobsData.data,
          totalPage: listJobsData.totalPage,
          currentPage: listJobsData.currentPage,
          count: listJobsData.count,
        })
      );
    }
  }, [dispatch, listJobsData]);

  useEffect(() => {
    dispatch(setTitle("quản lý tin tuyển dụng"));
  }, [dispatch]);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleResetFilter = () => {
    setOrderBy("");
    setSortBy("");
    setExperienceSelected("");
    setStatusJobSelected("");
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleViewJobDetail = useCallback(
    ({ _id }) => {
      openDrawer();
      setJobDetailData(listJobsData.data.find((job) => job._id === _id));
    },
    [listJobsData?.data]
  );

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSelectedExperience = (e) => {
    setExperienceSelected(e);
  };

  const handleSelectedStatusJob = (e) => {
    setStatusJobSelected(e);
  };

  const handleRemoveJobItem = async ({ _id, addressId }) => {
    try {
      setOpen(false);
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
          const response = await deleteJob({
            userId: user?._id,
            employerId: user?.ownerEmployerId?._id,
            jobId: _id,
            addressId,
          });
          if (response && response.data && response.data.success) {
            dispatch(removeJobItem({ _id }));
            toast.success("Xoá tin tuyển dụng thành công !");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleSwitchStatustJob = async ({ _id }) => {
    try {
      const response = await toggleHiringStatusJob({
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
        jobId: _id,
      });

      if (response && response.data && response.data.success) {
        dispatch(updateHiringStatusJob(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="m-[10px]">
      {(isFetching || isLoading || isLoadingDeleteJob) && <Loading />}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
        <div className="flex items-center gap-3">
          <SelectCustom
            label="Sắp xếp theo"
            options={sortByOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e)}
          />
          <SelectCustom
            label="Thứ tự theo"
            options={orderByOptions}
            value={orderBy}
            onChange={(e) => setOrderBy(e)}
          />
          <SelectCustom
            label="Trạng thái"
            options={statusOptions}
            value={statusJobSelected}
            onChange={handleSelectedStatusJob}
          />
          <SelectCustom
            label="Kinh nghiệm"
            options={experiens}
            value={experienceSelected}
            onChange={handleSelectedExperience}
          />
          <ButtonCustom
            className="text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 whitespace-nowrap"
            onClick={handleResetFilter}
          >
            Đặt lại
          </ButtonCustom>
        </div>
        <div className="flex items-center gap-3">
          <Input
            label="Tìm kiếm vị trí tuyển dụng"
            value={search}
            onChange={handleChangeSearch}
          />
          <Link to="/create-recruitment-job">
            <Button className="capitalize bg-[#164e63] whitespace-nowrap">
              Thêm tin tuyển dụng
            </Button>
          </Link>
        </div>
        <div className="">
          <table className="w-full text-sm font-bold text-left cursor-pointer border border-blue-gray-100 !rounded-md">
            <thead className="text-xs  text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
              <tr>
                {tableHeadJob.map(({ id, name }) => {
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
              {listJobs?.length > 0 &&
                listJobs.map((job, index) => {
                  return (
                    <tr
                      className="bg-white border-b border-blue-gray-100 hover:bg-gray-100 "
                      key={job?._id || index}
                    >
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        <SwitchCustom
                          _id={job?._id}
                          isChecked={job?.isHiring}
                          onChange={() =>
                            handleToggleSwitchStatustJob({ _id: job?._id })
                          }
                        />
                      </td>
                      <td
                        colSpan={1}
                        className="px-2 text-xs font-bold py-1 text-blue-gray-800"
                      >
                        {job?.recruitmentCampaignName}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        {job?.recruitmentTitle.slice(0, 25)}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        {job?.industry}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        {job?.appliedIds?.length}
                      </td>
                      <td className="py-1 text-center text-blue-gray-800">
                        <JobStatusBadge status={job?.status} />
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        {covertToDate(job?.createdAt)}
                      </td>
                      <td className="px-1 text-xs font-bold py-1 text-blue-gray-800 flex items-center gap-1 justify-center">
                        <ButtonCustom
                          className="text-xs capitalize font-bold rounded-md min-w-[90px] !p-3 bg-red-50 text-red-500"
                          onClick={() =>
                            handleRemoveJobItem({
                              _id: job?._id,
                              addressId: job?.workRegion?._id,
                            })
                          }
                        >
                          Xoá
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleViewJobDetail({ _id: job?._id })}
                          className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-blue-50 text-blue-500"
                        >
                          Xem
                        </ButtonCustom>
                        <ButtonCustom
                          className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-green-50 text-green-500"
                          to={`/create-recruitment-job?jobId=${job?._id}`}
                        >
                          Sửa
                        </ButtonCustom>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Pagination
          totalPage={totalPage}
          handlePageChange={handlePageChange}
          page={page}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
      <Drawer
        placement="right"
        size={700}
        open={open}
        onClose={closeDrawer}
        className="p-4 bg-[#e8edf2] h-[calc(100vh-200px)] overflow-auto"
        transition={{ type: "spring", duration: 0.5 }}
      >
        <JobDetail jobDetailData={jobDetailData} />
      </Drawer>
    </div>
  );
};

export default ListJobsPage;
