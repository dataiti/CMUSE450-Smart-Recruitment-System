import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import {
  desiredSalaryOptions,
  statusOptions,
  tableHeadEmployer,
} from "../../utils/constants";
import { covertToDate } from "../../utils/fn";
import {
  Avatar,
  Button,
  Drawer,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useDebounce } from "../../hooks";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setTitle } from "../../redux/features/slices/titleSlice";
import {
  useDeleteEmployerMutation,
  useGetListOfEmployerForAdminQuery,
  useToggleLockEmployerMutation,
} from "../../redux/features/apis/employerApi";
import {
  employerSelect,
  removeEmployerItem,
  setListEmployers,
  updateToggleLockEmployer,
} from "../../redux/features/slices/employerSlice";
import { EmployerDetail } from "../../pages";
import Swal from "sweetalert2";
import {
  StatusBadge,
  ButtonCustom,
  SwitchCustom,
  Loading,
  SelectCustom,
  Pagination,
} from "../../components/shares";

const ManageEmployer = () => {
  const dispatch = useDispatch();

  const { listEmployers, totalPage } = useSelector(employerSelect);
  const { user } = useSelector(authSelect);

  const [orderBy, setOrderBy] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const [statusSelected, setStatusSelected] = useState("");
  const [employerDetailData, setEmployerDetailData] = useState({});

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
  const [deleteEmployer, { isLoadingDelete }] = useDeleteEmployerMutation();
  const [toggleLockEmployer, { isLoadingToggle }] =
    useToggleLockEmployerMutation();

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

  const handleViewEmployerDetail = useCallback(
    ({ _id }) => {
      openDrawer();
      setEmployerDetailData(
        listEmployersData.data.find((job) => job._id === _id)
      );
    },
    [listEmployersData?.data]
  );

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleSelectedStatus = (e) => {
    setStatusSelected(e);
  };

  const handleRemoveEmployerItem = async ({ _id, addressId }) => {
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
          const response = await deleteEmployer({
            userId: user?._id,
            employerId: user?.ownerEmployerId?._id,
            addressId,
          });
          if (response && response.data && response.data.success) {
            dispatch(removeEmployerItem({ _id }));
            toast.success("Xoá nhà tuyển dụng thành công !");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleSwitchLockEmployer = async ({ _id }) => {
    try {
      const response = await toggleLockEmployer({
        userId: user?._id,
        employerId: _id,
      });

      if (response && response.data && response.data.success) {
        dispatch(updateToggleLockEmployer(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-[10px] my-[10px]">
      {(isFetching || isLoadingDelete || isLoadingToggle) && <Loading />}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-md">
        <div className="grid grid-cols-6 gap-2">
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
          <Link to="/create-employer">
            <Button className="capitalize bg-[#164e63] whitespace-nowrap">
              Thêm nhà tuyển dụng
            </Button>
          </Link>
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
                      <td className="flex justify-center px-2 text-xs font-bold py-1 text-blue-gray-800 whitespace-nowrap">
                        <SwitchCustom
                          _id={employer?._id}
                          isChecked={employer?.isLocked}
                          onChange={() =>
                            handleToggleSwitchLockEmployer({
                              _id: employer?._id,
                            })
                          }
                        />
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={employer?.companyLogo}
                            alt=""
                            className="rounded-full h-[47px] w-[47px] p-1 bg-blue-gray-100"
                          />
                          <div className="flex flex-col">
                            <Typography className="text-xs font-bold">
                              {employer?.companyName}
                            </Typography>
                            <Typography className="text-xs font-medium text-gray-500 italic">
                              {employer?.companyEmail}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 text-xs font-bold py-1 text-blue-gray-800 whitespace-pre-wrap">
                        {employer?.companyIndustry}
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-blue-gray-800">
                        {employer?.companySize}
                      </td>
                      <td className="py-1 text-center text-blue-gray-800">
                        <StatusBadge status={employer?.status} />
                      </td>
                      <td className="px-2 text-xs font-bold py-1 text-center text-blue-gray-800">
                        {covertToDate(employer?.createdAt)}
                      </td>
                      <td className="px-1 text-xs font-bold py-1 text-blue-gray-800 flex items-center justify-center gap-2">
                        <ButtonCustom
                          onClick={() =>
                            handleViewEmployerDetail({ _id: employer?._id })
                          }
                          className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-blue-50 text-blue-500"
                        >
                          Xem
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() =>
                            handleRemoveEmployerItem({
                              _id: employerDetailData?._id,
                              addressId: employerDetailData?.addressId,
                            })
                          }
                          className="text-xs capitalize font-bold rounded-md min-w-[90px] bg-red-50 text-red-500"
                        >
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
      >
        <EmployerDetail employerDetailData={employerDetailData} />
      </Drawer>
    </div>
  );
};

export default ManageEmployer;
