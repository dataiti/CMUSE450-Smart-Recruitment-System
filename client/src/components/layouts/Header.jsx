import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { icons } from "../../utils/icons";
import { LoginForm, RegisterForm } from "../forms";
import { authSelect, logOut } from "../../redux/features/slices/authSlice";
import { images } from "../../assets/images";
import { menuItems, navbarItems } from "../../utils/constants";
import { useLogOutMutation } from "../../redux/features/apis/authApi";
import {
  ButtonCustom,
  IconButtonCustom,
  ListNotification,
  Modal,
} from "../shares";
import { useDebounce } from "../../hooks";
import { socket } from "../../socket";
import {
  useDeleteSearchMutation,
  useSaveSearchMutation,
  useGetListJobsByKeywordForUserQuery,
} from "../../redux/features/apis/searchApi";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user, refreshToken } = useSelector(authSelect);

  const [logout] = useLogOutMutation();

  const [openRegisterForm, setOpenegisterForm] = useState(false);
  const [openLoginForm, setOpenLoginForm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [indexNavbar, setIndexNavbar] = useState(1);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [listSearchValue, setListSearchValue] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [listNotifications, setListNotifications] = useState([]);
  const [isLoadingNotification, setIsLoadingNotification] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setIsLoadingNotification(true);
    socket?.emit("get_list_notifications", { userId: user?._id });
  }, [user?._id]);

  socket?.on("user_get_list_notifications", ({ message }) => {
    setIsLoadingNotification(true);
    setListNotifications(message);
    setIsLoadingNotification(false);
  });

  const searchDobouceValue = useDebounce(searchValue, 800);

  const inputRef = useRef();

  const { data: searchData, isFetching } = useGetListJobsByKeywordForUserQuery(
    {
      userId: user?._id,
      keyword: searchDobouceValue || "",
    },
    { skip: !user?._id, refetchOnMountOrArgChange: true }
  );

  const [deleteSearch] = useDeleteSearchMutation();
  const [saveSearch] = useSaveSearchMutation();

  useEffect(() => {
    setListSearchValue(searchData?.data);
  }, [searchData]);

  socket?.on("user_get_list_notifications", ({ message }) => {
    setListNotifications(message);
  });

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleClickSearchIem = ({ keyword }) => {
    setIsFocus(false);
    setSearchValue(keyword);
    navigate(`/categories-job?keyword=${searchValue}`);
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsFocus(false);
    }
  };

  const handleOpenRegisterForm = () => setOpenegisterForm((cur) => !cur);

  const handleOpenLoginForm = () => setOpenLoginForm((cur) => !cur);

  const handleClear = () => {
    setSearchValue("");
    inputRef.current.focus();
  };

  const handleEnterKeywordSearch = async (e) => {
    if (e.key === "Enter") {
      setIsFocus(false);
      if (searchValue) {
        await saveSearch({ userId: user?._id, keyword: searchValue });
        navigate(`/categories-job?keyword=${searchValue}`);
      } else {
        navigate("/categories-job");
      }
    }
  };

  const handleGetNotifications = () => {
    setIsOpenNotification((prev) => !prev);
    socket?.emit("get_list_notifications", { userId: user?._id });
  };

  const handleDeleteSearchKeyword = async ({ searchId }) => {
    await deleteSearch({ userId: user?._id, searchId });
    setListSearchValue((prev) => {
      return prev.filter((search) => {
        return search?._id?.toString() !== searchId?.toString();
      });
    });
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
          <Link to="/">
            <img
              className="h-14 w-14 rounded-lg object-cover"
              src={images.logo}
              alt=""
            />
          </Link>
          {navbarItems.map((item) => {
            return (
              <div className="" key={item.id}>
                {item.childrens ? (
                  <Menu className="!outline-none !border-none">
                    <MenuHandler>
                      <Typography
                        className={`font-bold text-sm uppercase cursor-pointer ${
                          item.id === indexNavbar
                            ? "text-light-blue-500"
                            : "text-white"
                        }`}
                      >
                        {item.title}
                      </Typography>
                    </MenuHandler>
                    <MenuList className="hover:border-none">
                      <ul className="col-span-4 flex w-full flex-col gap-1">
                        {item.childrens.map(({ id, title, path }) => (
                          <li key={id}>
                            <Link to={path}>
                              <MenuItem
                                className="bg-gray-200 flex items-center gap-4 py-3"
                                onClick={() => setIndexNavbar(item.id)}
                              >
                                <Typography className="mb-1 text-sm font-bold">
                                  {title}
                                </Typography>
                              </MenuItem>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </MenuList>
                  </Menu>
                ) : (
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
                )}
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-full w-[28%] px-4 py-2 mx-2 relative">
          <IconButtonCustom className="w-[36px] h-[36px] absolute left-1 top-[50%] -translate-y-[50%] bg-teal-700 text-white">
            <icons.FiSearch size={20} />
          </IconButtonCustom>
          <input
            className="outline-none w-full pl-8 py-1 placeholder:text-sm text-sm text-[#212f3f] font-bold"
            placeholder="Nhập từ khoá để tìm kiếm..."
            spellCheck="false"
            ref={inputRef}
            value={searchValue}
            onKeyDown={handleEnterKeywordSearch}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsFocus(true);
            }}
            onFocus={() => setIsFocus(true)}
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
          {isFocus && (
            <div className="absolute top-[110%] left-0 overflow-hidden bg-white w-full rounded-md flex flex-col shadow-md">
              {listSearchValue?.map((searchItem) => {
                return (
                  <div
                    className="flex items-center justify-between hover:bg-blue-gray-50 cursor-pointer transition-all  py-3 px-4 "
                    key={searchItem?._id}
                    onClick={() =>
                      handleClickSearchIem({ keyword: searchItem?.keyword })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-light-blue-500">
                        {user?._id.toString() ===
                        searchItem?.userId?.toString() ? (
                          <icons.MdAccessTimeFilled size={20} />
                        ) : (
                          <icons.FiSearch size={20} />
                        )}
                      </span>
                      <Typography className="text-sm font-bold flex-1 name">
                        {searchItem?.keyword}
                      </Typography>
                    </div>
                    {user?._id.toString() ===
                      searchItem?.userId?.toString() && (
                      <button
                        className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          return handleDeleteSearchKeyword({
                            userId: user?._id,
                            searchId: searchItem?._id,
                          });
                        }}
                      >
                        <icons.IoClose size={16} />
                      </button>
                    )}
                  </div>
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
            <button
              className="shadow-none p-3 rounded-full bg-white text-[#0891b2] relative z-20"
              onClick={handleGetNotifications}
            >
              <icons.PiBellRingingFill size={20} />
              <span className="absolute z-30 top-[-3px] right-[-3px] bg-red-500 p-[3px] rounded-full text-white">
                <icons.IoAlertSharp size={12} />
              </span>
              {isOpenNotification && (
                <ListNotification
                  listNotifications={listNotifications}
                  isLoading={isLoadingNotification}
                  setOpenModal={setOpenModal}
                  setListNotifications={setListNotifications}
                />
              )}
            </button>
            <Link to="/messenger">
              <button className="shadow-none p-3 rounded-full bg-white text-[#0891b2] relative z-20">
                <icons.BsMessenger size={20} />
                <span className="absolute z-30 top-[-3px] right-[-3px] bg-red-500 p-[3px] rounded-full text-white">
                  <icons.IoAlertSharp size={12} />
                </span>
              </button>
            </Link>
            <Link to="/wishlist">
              <button className="shadow-none p-3 rounded-full bg-white text-[#0891b2] relative">
                <icons.IoBookmark size={20} />
                <span className="absolute z-30 top-[-3px] right-[-3px] bg-red-500 p-[3px] rounded-full text-white">
                  <icons.IoAlertSharp size={12} />
                </span>
              </button>
            </Link>
            <Menu className="!outline-none !border-none">
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
      <Modal open={openModal}>dasdas</Modal>
    </div>
  );
};

export default Header;
