import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { icons } from "../utils/icons";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { authSelect, logOut } from "../redux/features/slices/authSlice";
import { images } from "../assets/images";
import { menuItems, navbarItems } from "../utils/constants";
import { useLogOutMutation } from "../redux/features/apis/authApi";
import ButtonCustom from "./ButtonCustom";
import IconButtonCustom from "./IconButtonCustom";
import { useDebounce } from "../hooks";
import { useGetListSearchJobsQuery } from "../redux/features/apis/jobApi";
import { socket } from "../socket";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user, refreshToken } = useSelector(authSelect);

  const [logout] = useLogOutMutation();

  const [openRegisterForm, setOpenegisterForm] = useState(false);
  const [openLoginForm, setOpenLoginForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [listSearchValue, setListSearchValue] = useState([]);
  const [listNotifications, setListNotifications] = useState([]);
  const [indexNavbar, setIndexNavbar] = useState(1);

  const searchDobouceValue = useDebounce(searchValue, 800);

  const inputRef = useRef();

  const { data: searchData, isFetching } = useGetListSearchJobsQuery(
    { search: searchDobouceValue },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    setListSearchValue(searchData?.data);
  }, [searchData]);

  useEffect(() => {
    socket?.emit("get_list_notifications", { userId: user?._id });
  }, [user?._id]);

  socket?.on("user_get_list_notifications", ({ message }) => {
    setListNotifications(message);
  });

  const handleOpenRegisterForm = () => setOpenegisterForm((cur) => !cur);

  const handleOpenLoginForm = () => setOpenLoginForm((cur) => !cur);

  const handleClear = () => {
    setSearchValue("");
    inputRef.current.focus();
  };

  const handleClickSearchIem = ({ _id }) => {
    setIsFocus(false);
    navigate(`/job-detail/${_id}`);
  };

  const handleLogout = async () => {
    try {
      const response = await logout({ refreshToken });
      if (response && response.data && response.data.success) {
        dispatch(logOut());
        toast.success("Đăng xuất thành công !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#212f3f] h-full">
      <div className="h-full w-full flex items-center justify-between px-[110px]">
        <div className="p-0 flex-1 h-full w-full flex items-center gap-5 text-white">
          <img
            className="h-14 w-14 rounded-lg object-cover"
            src={images.logo}
            alt=""
          />
          {navbarItems.map((item) => {
            return (
              <div className="" key={item.id}>
                <Link
                  to={item.path}
                  className={`font-bold text-sm uppercase ${
                    item.id === indexNavbar
                      ? "text-light-blue-500"
                      : "text-white"
                  }`}
                  onClick={() => setIndexNavbar(item.id)}
                >
                  {item.title}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-full w-[28%] px-4 py-2 mx-2 relative">
          <IconButtonCustom className="w-[34px] h-[34px] absolute left-1 top-[50%] -translate-y-[50%]">
            <icons.FiSearch size={20} />
          </IconButtonCustom>
          <input
            className="outline-none w-full pl-8 placeholder:text-sm text-sm text-[#212f3f] font-bold"
            placeholder="Nhập từ khoá để tìm kiếm..."
            spellCheck="false"
            ref={inputRef}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsFocus(true);
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => {
              if (!isFocus) {
                setIsFocus(false);
              }
            }}
          />
          {!!searchValue && !isFetching && (
            <span
              className="absolute right-2 text-gray-600 hover:text-gray-500 cursor-pointer"
              onClick={handleClear}
            >
              <icons.IoCloseCircleSharp size={24} />
            </span>
          )}
          {isFetching && (
            <span className="absolute right-2 animate-spin text-gray-600">
              <icons.BiLoaderCircle size={24} />
            </span>
          )}
          {isFocus && listSearchValue?.length > 0 && (
            <div className="absolute top-[110%] left-0 overflow-hidden bg-white w-full rounded-md flex flex-col gap-2 shadow-md">
              {listSearchValue.map((searchItem) => {
                return (
                  <Typography
                    className="text-xs font-bold flex items-center gap-2 hover:bg-blue-gray-50 py-2 px-4 cursor-pointer transition-all"
                    key={searchItem?._id}
                    onClick={() =>
                      handleClickSearchIem({ _id: searchItem?._id })
                    }
                  >
                    <icons.FiSearch size={20} />
                    {searchItem?.recruitmentTitle}
                  </Typography>
                );
              })}
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="flex-1 flex items-center gap-3 justify-end">
            <>
              <ButtonCustom onClick={handleOpenRegisterForm}>
                Đăng ký
              </ButtonCustom>
              <RegisterForm
                open={openRegisterForm}
                handleOpen={handleOpenRegisterForm}
              />
              <ButtonCustom onClick={handleOpenLoginForm}>
                Đăng nhập
              </ButtonCustom>
              <LoginForm
                open={openLoginForm}
                handleOpen={handleOpenLoginForm}
              />
              <Link to="http://localhost:3001" target="_blank">
                <ButtonCustom className="bg-teal-800 hover:bg-teal-700">
                  Kênh nhà tuyển dụng
                </ButtonCustom>
              </Link>
            </>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Menu>
              <MenuHandler>
                <IconButton className="shadow-none p-3 rounded-full bg-white text-[#0891b2]">
                  <icons.PiBellRingingFill size={20} />
                </IconButton>
              </MenuHandler>
              <MenuList className="hover:border-none">
                <ul className="col-span-4 flex flex-col gap-1 w-[360px] h-[400px] overflow-y-auto">
                  {listNotifications?.map((item) => (
                    <li key={item?._id}>
                      <Link to={item?.url}>
                        <MenuItem
                          className={` flex items-center gap-4 !hover:bg-blue-100 ${
                            item?.isViewed ? "bg-white" : "bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={item?.employerId?.companyLogo}
                              alt=""
                              className="flex-none bg-blue-gray-600 !w-14 !h-14 object-contain !rounded-md"
                            />
                            <div>
                              <Typography className="mb-1 text-sm font-medium name text-black">
                                {item?.title}
                              </Typography>
                              <Typography className="mb-1 text-sm font-medium name text-gray-500">
                                {item?.content}
                              </Typography>
                            </div>
                          </div>
                        </MenuItem>
                      </Link>
                    </li>
                  ))}
                </ul>
              </MenuList>
            </Menu>
            <Link to="/messenger">
              <IconButton className="shadow-none p-3 rounded-full bg-white text-[#0891b2]">
                <icons.BsMessenger size={20} />
              </IconButton>
            </Link>
            <Link to="/wishlist">
              <IconButton className="shadow-none p-3 rounded-full bg-white text-[#0891b2]">
                <icons.IoBookmark size={20} />
              </IconButton>
            </Link>
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  className="text-base font-normal capitalize tracking-normal shadow-none active:shadow-none flex items-center gap-2 p-1 rounded-full bg-[#0891b2] cursor-pointer hover:bg-[#06b6d4] active:bg-[#06b6d4] transition-all"
                >
                  <Avatar
                    variant="circular"
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className="h-10 w-10 border-2 border-white hover:z-10 focus:z-10 "
                    src={user?.avatar}
                  />
                  <div>
                    <Typography className="text-sm font-bold">{`${user?.firstName} ${user?.lastName}`}</Typography>
                    <Typography className="text-xs font-bold text-white">
                      {user?.email}
                    </Typography>
                  </div>
                  <icons.FiChevronDown />
                </Button>
              </MenuHandler>
              <MenuList className="hover:border-none">
                <ul className="col-span-4 flex w-full flex-col gap-1">
                  {menuItems.map(({ id, title, icon, path }) => (
                    <li key={id}>
                      <Link to={path}>
                        <MenuItem className="bg-gray-200 flex items-center gap-4 py-3">
                          {icon}
                          <Typography
                            color="blue-gray"
                            className="mb-1 text-sm font-medium"
                          >
                            {title}
                          </Typography>
                        </MenuItem>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <MenuItem
                      className="bg-gray-200 flex items-center gap-4 py-3"
                      onClick={handleLogout}
                    >
                      <icons.IoLogOutOutline size={24} />
                      <Typography
                        color="blue-gray"
                        className="mb-1 text-sm font-medium"
                      >
                        Đăng xuất
                      </Typography>
                    </MenuItem>
                  </li>
                </ul>
              </MenuList>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
