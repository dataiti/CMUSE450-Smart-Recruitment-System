import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeJobItem } from "../../redux/features/slices/jobSlice";
import { useDeleteJobMutation } from "../../redux/features/apis/jobApi";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  desiredSalaryOptions,
  statusOptions,
  tableHeadUser,
} from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import { Avatar, Drawer, Input, Typography } from "@material-tailwind/react";
import { useDebounce } from "../../hooks";
import { toast } from "react-toastify";
import { setTitle } from "../../redux/features/slices/titleSlice";
import { useGetListUserForAdminQuery } from "../../redux/features/apis/userApi";
import {
  setListUsers,
  userSelect,
} from "../../redux/features/slices/userSlice";
import {
  StatusBadge,
  ButtonCustom,
  SwitchCustom,
  Loading,
  SelectCustom,
  Pagination,
} from "../../components/shares";

const ManageUser = () => {
  const dispatch = useDispatch();

  const { listUsers, totalPage } = useSelector(userSelect);
  const { user } = useSelector(authSelect);

  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(9);
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

  const handleToggleSwitchLockUser = async () => {};

  return (
    <div className="mx-[10px] my-[10px]">
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
                      <td className="flex justify-center px-2 text-xs font-bold py-1 text-blue-gray-800 whitespace-nowrap">
                        <SwitchCustom
                          _id={user?._id}
                          isChecked={user?.isLocked}
                          onChange={() =>
                            handleToggleSwitchLockUser({
                              _id: user?._id,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={user?.avatar}
                            alt=""
                            className="rounded-full h-11 w-11 p-1 bg-blue-gray-100"
                          />
                          <div className="flex flex-col">
                            <Typography className="text-xs font-bold">
                              {user?.firstName} {user?.lastName}
                            </Typography>
                            <Typography className="text-xs font-medium text-gray-500 italic">
                              {user?.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-xs font-bold py-1 text-blue-gray-800 whitespace-pre-wrap">
                        {user?.ownerEmployerId && "Doanh Nghiệp"}
                        {user?.permission === "user" && " | Người Dùng"}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        {user?.ownerEmployerId ? (
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={user?.ownerEmployerId?.companyLogo}
                              alt=""
                              className="rounded-full h-11 w-11 p-1 bg-blue-gray-100"
                            />
                            <div className="flex flex-col">
                              <Typography className="text-xs font-bold">
                                {user?.ownerEmployerId?.companyName}
                              </Typography>
                              <Typography className="text-xs font-medium text-gray-500 italic">
                                {user?.ownerEmployerId?.companyEmail}
                              </Typography>
                            </div>
                          </div>
                        ) : (
                          <Typography className="font-bold text-xs">
                            Không
                          </Typography>
                        )}
                      </td>
                      <td className="py-1 text-center text-blue-gray-800">
                        <StatusBadge status={user?.status} />
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        {covertToDate(user?.createdAt)}
                      </td>
                      <td className="px-1 text-xs font-bold py-1 text-blue-gray-800 flex items-center justify-center gap-2">
                        <ButtonCustom
                          onClick={() =>
                            handleViewJobDetail({ _id: user?._id })
                          }
                          className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-blue-50 text-blue-500"
                        >
                          Xem
                        </ButtonCustom>
                        <ButtonCustom className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-red-50 text-red-500">
                          Xoá
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
      ></Drawer>
    </div>
  );
};

export default ManageUser;
