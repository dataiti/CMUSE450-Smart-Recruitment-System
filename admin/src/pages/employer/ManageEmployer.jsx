import React, { useCallback, useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { jobSelect, removeJobItem } from "../../redux/features/slices/jobSlice";
import { useDeleteJobMutation } from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import parse from "html-react-parser";
import {
  companySizesOptions,
  desiredSalaryOptions,
  experiens,
  statusOptions,
  tableHeadEmployer,
} from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import { Button, Drawer, Input, Typography } from "@material-tailwind/react";
import SelectCustom from "../../components/SelectCustom";
import { useDebounce } from "../../hooks";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setTitle } from "../../redux/features/slices/titleSlice";
import Loading from "../../components/Loading";
import { useGetListOfEmployerForAdminQuery } from "../../redux/features/apis/employerApi";
import {
  employerSelect,
  setListEmployers,
} from "../../redux/features/slices/employerSlice";

const ManageEmployer = () => {
  const dispatch = useDispatch();

  const { listEmployers, totalPage } = useSelector(employerSelect);
  const { user } = useSelector(authSelect);

  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [statusSelected, setStatusSelected] = useState("");
  const [jobDetailData, setJobDetailData] = useState({});

  const debouncedValue = useDebounce(search, 500);

  const [open, setOpen] = useState(false);

  const { data: listEmployersData, isFetching } =
    useGetListOfEmployerForAdminQuery(
      {
        userId: user?._id,
        search: debouncedValue,
        sortBy,
        orderBy,
        page,
        limit,
        status: statusSelected,
      },
      { refetchOnMountOrArgChange: true }
    );
  const [deleteJob] = useDeleteJobMutation();

  useEffect(() => {
    if (listEmployersData && listEmployersData.success) {
      dispatch(
        setListEmployers({
          data: listEmployersData.data,
          totalPage: listEmployersData.totalPage,
          currentPage: listEmployersData.currentPage,
          count: listEmployersData.count,
        })
      );
    }
  }, [dispatch, listEmployersData]);

  useEffect(() => {
    dispatch(setTitle("quản lý nhà tuyển dụng"));
  }, [dispatch]);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleViewJobDetail = useCallback(
    ({ _id }) => {
      openDrawer();
      setJobDetailData(listEmployersData.data.find((job) => job._id === _id));
    },
    [listEmployersData?.data]
  );

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSelectedStatus = (e) => {
    setStatusSelected(e);
  };

  const handleRemoveJobItem = async ({ _id, addressId }) => {
    try {
      const response = await deleteJob({
        userId: user?._id,
        employerId: user?.ownerEmployerId?._id,
        jobId: _id,
        addressId,
      });

      if (response && response.data && response.data.success) {
        dispatch(removeJobItem({ _id }));
        setOpen(false);
        toast.success("Xoá tin tuyển dụng thành công !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-[30px] my-[30px]">
      {isFetching && <Loading />}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-2">
            <Input
              label="Tìm kiếm vị trí tuyển dụng"
              value={search}
              onChange={handleChangeSearch}
            />
          </div>
          <SelectCustom label="Sắp xếp theo" options={desiredSalaryOptions} />
          <SelectCustom label="Thứ tự" options={desiredSalaryOptions} />
          <SelectCustom
            label="Trạng thái"
            options={statusOptions}
            value={statusSelected}
            onChange={handleSelectedStatus}
          />
        </div>
        <div className="">
          <table className="w-full text-sm font-bold text-left cursor-pointer border border-blue-gray-100 !rounded-md">
            <thead className="text-xs  text-[#212f3f] bg-blue-gray-100 uppercase border-b border-blue-gray-100">
              <tr>
                {tableHeadEmployer.map(({ id, name }) => {
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
              {listEmployers?.length > 0 &&
                listEmployers.map((employer, index) => {
                  return (
                    <tr
                      className="bg-white border-b border-blue-gray-100 hover:bg-gray-100 "
                      key={employer?._id || index}
                    >
                      <td className="px-2 text-sm font-bold py-3 text-blue-gray-800 whitespace-nowrap">
                        ... {employer?._id.slice(-4)}
                      </td>
                      <td className="px-2 text-sm font-bold py-1 text-blue-gray-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={employer?.companyLogo}
                            alt=""
                            className="rounded-md w-10"
                          />
                          <div className="flex flex-col">
                            <Typography className="text-sm font-bold">
                              {employer?.companyName}
                            </Typography>
                            <Typography className="text-sm font-medium text-gray-500 italic">
                              {employer?.companyEmail}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-sm font-bold py-3 text-blue-gray-800 whitespace-pre-wrap">
                        {employer?.companyIndustry}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-blue-gray-800">
                        {employer?.companySize}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-center text-blue-gray-800">
                        {employer?.companyLocation}
                      </td>
                      <td className="py-3 text-center text-blue-gray-800">
                        {employer.status === "pending" ? (
                          <div className="p-2 rounded-md text-[10px] bg-blue-50 text-blue-500">
                            Chờ phê duyệt
                          </div>
                        ) : employer.status === "active" ? (
                          <div className="p-2 rounded-md text-[10px] bg-green-50 text-green-500">
                            Đang hoạt động
                          </div>
                        ) : employer.status === "expired" ? (
                          <div className="p-2 rounded-md text-[10px] bg-yellow-50 text-yellow-500">
                            Đã hết hạn
                          </div>
                        ) : (
                          <div className="p-2 rounded-md text-[10px] bg-red-50 text-red-500">
                            Bị từ chối
                          </div>
                        )}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-center text-blue-gray-800">
                        {covertToDate(employer?.createdAt)}
                      </td>
                      <td className="px-1 text-sm font-bold py-3 text-blue-gray-800">
                        <Button
                          variant="filled"
                          onClick={() =>
                            handleViewJobDetail({ _id: employer?._id })
                          }
                          className="text-xs capitalize font-bold rounded-full !px-4 !py-3 bg-blue-gray-900 text-light-blue-600"
                        >
                          Xem thêm
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="">
          <Pagination
            totalPage={totalPage}
            handlePageChange={handlePageChange}
            page={page}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>
      <Drawer
        placement="right"
        size={700}
        open={open}
        onClose={closeDrawer}
        className="p-4 bg-[#e8edf2] h-[calc(100vh-200px)] overflow-auto"
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* <div className="w-full bg-white rounded-md fixed top-0 z-20">
          <div className="w-full flex items-center gap-3 p-4">
            <Button
              className="bg-[#7f1d1d] capitalize ro"
              onClick={() =>
                handleRemoveJobItem({
                  _id: jobDetailData?._id,
                  addressId: jobDetailData?.workRegion?._id,
                })
              }
            >
              Xoá
            </Button>
            <Button className="bg-[#164e63] capitalize">Chỉnh sửa</Button>
            <Button className="bg-[#134e4a] capitalize">
              Danh sách CV ứng tuyển
            </Button>
            <Button
              className="bg-[#374151] capitalize"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-[70px]">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-md ">
            <Typography className="uppercase text-[#212f3f] font-bold text-lg">
              {jobDetailData?.recruitmentTitle}
            </Typography>
            <div className="grid grid-cols-3">
              <div className="flex items-center gap-2">
                <IconButton className="rounded-full bg-[#fde68a]">
                  <icons.AiFillDollarCircle size={30} />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <Typography className="text-sm font-bold">
                    Mức lương
                  </Typography>
                  <Typography className="text-xs">
                    {jobDetailData?.experience}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton className="rounded-full bg-[#fde68a]">
                  <icons.HiLocationMarker size={30} />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <Typography>Địa điểm</Typography>
                  <Typography className="text-xs">
                    {jobDetailData?.workRegion?.province}
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconButton className="rounded-full bg-[#fde68a]">
                  <icons.AiFillClockCircle size={30} />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <Typography>Kinh nghiệm</Typography>
                  <Typography className="text-xs">
                    {jobDetailData?.experience}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
              Mô tả công việc
            </Typography>
            <div className="text-sm font-bold py-2">
              {(jobDetailData.jobDescription &&
                parse(jobDetailData.jobDescription)) ||
                ""}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
              Yêu cầu ứng viên
            </Typography>
            <div className="text-sm font-bold py-2">
              {(jobDetailData.candidateRequirements &&
                parse(jobDetailData.candidateRequirements)) ||
                ""}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md ">
            <Typography className="border-b-4 border-[#164e63] uppercase text-sm font-bold pb-1">
              Phúc lợi ứng viên
            </Typography>
            <div className="text-sm font-bold py-2">
              {(jobDetailData.candidateBenefits &&
                parse(jobDetailData.candidateBenefits)) ||
                ""}
            </div>
          </div>
        </div> */}
      </Drawer>
    </div>
  );
};

export default ManageEmployer;
