import React, { useCallback, useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { removeJobItem } from "../../redux/features/slices/jobSlice";
import { useDeleteJobMutation } from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  desiredSalaryOptions,
  statusOptions,
  tableHeadEmployer,
  tableHeadUser,
} from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import { Button, Drawer, Input, Typography } from "@material-tailwind/react";
import SelectCustom from "../../components/SelectCustom";
import { useDebounce } from "../../hooks";
import { toast } from "react-toastify";
import { setTitle } from "../../redux/features/slices/titleSlice";
import Loading from "../../components/Loading";
import { useGetListUserForAdminQuery } from "../../redux/features/apis/userApi";
import {
  setListUsers,
  userSelect,
} from "../../redux/features/slices/userSlice";

const ManageUser = () => {
  const dispatch = useDispatch();

  const { listUsers, totalPage } = useSelector(userSelect);
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

  const { data: listUsersData, isFetching } = useGetListUserForAdminQuery(
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
    if (listUsersData && listUsersData.success) {
      dispatch(
        setListUsers({
          data: listUsersData.data,
          totalPage: listUsersData.totalPage,
          currentPage: listUsersData.currentPage,
          count: listUsersData.count,
        })
      );
    }
  }, [dispatch, listUsersData]);

  useEffect(() => {
    dispatch(setTitle("quản lý tài khoản người dùng"));
  }, [dispatch]);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleViewJobDetail = useCallback(
    ({ _id }) => {
      openDrawer();
      setJobDetailData(listUsersData.data.find((job) => job._id === _id));
    },
    [listUsersData?.data]
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
                {tableHeadUser.map(({ id, name }) => {
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
              {listUsers?.length > 0 &&
                listUsers.map((user, index) => {
                  return (
                    <tr
                      className="bg-white border-b border-blue-gray-100 hover:bg-gray-100 "
                      key={user?._id || index}
                    >
                      <td className="px-2 text-sm font-bold py-3 text-blue-gray-800 whitespace-nowrap">
                        ... {user?._id.slice(-4)}
                      </td>
                      <td className="px-2 text-sm font-bold py-1 text-blue-gray-800">
                        <div className="flex items-center gap-2">
                          <img
                            src={user?.avatar}
                            alt=""
                            className="rounded-md w-10 border-2 border-cyan-500"
                          />
                          <div className="flex flex-col">
                            <Typography className="text-sm font-bold">
                              {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography className="text-sm font-medium text-gray-500 italic">
                              {user?.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-sm font-bold py-3 text-blue-gray-800 whitespace-pre-wrap">
                        {user?.permission}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-blue-gray-800">
                        {user?.ownerEmployerId ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={user?.ownerEmployerId?.companyLogo}
                              alt=""
                              className="rounded-md w-10"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-sm font-bold">
                                {user?.ownerEmployerId?.companyName}
                              </Typography>
                              <Typography className="text-sm font-medium text-gray-500 italic">
                                {user?.ownerEmployerId?.companyEmail}
                              </Typography>
                            </div>
                          </div>
                        ) : (
                          <Typography className="text-center font-bold">
                            Không
                          </Typography>
                        )}
                      </td>
                      <td className="py-3 text-center text-blue-gray-800">
                        {user.status === "active" ? (
                          <div className="p-2 rounded-md text-[10px] bg-green-50 text-green-500">
                            Đang hoạt động
                          </div>
                        ) : (
                          <div className="p-2 rounded-md text-[10px] bg-red-50 text-red-500">
                            Đã bị khoá
                          </div>
                        )}
                      </td>
                      <td className="px-2 text-sm font-bold py-3 text-center text-blue-gray-800">
                        {covertToDate(user?.createdAt)}
                      </td>
                      <td className="px-1 text-sm font-bold py-3 text-blue-gray-800">
                        <Button
                          variant="filled"
                          onClick={() =>
                            handleViewJobDetail({ _id: user?._id })
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

export default ManageUser;
