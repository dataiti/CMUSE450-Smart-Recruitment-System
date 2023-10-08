import React, { useState } from "react";
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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../utils/icons";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { authSelect, logOut } from "../redux/features/slices/authSlice";
import { images } from "../assets/images";
import { menuItems, navbarItems } from "../utils/constants";
import { useLogOutMutation } from "../redux/features/apis/authApi";

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user, refreshToken } = useSelector(authSelect);

  const [logout] = useLogOutMutation();

  const [openRegisterForm, setOpenegisterForm] = useState(false);
  const [openLoginForm, setOpenLoginForm] = useState(false);

  const handleOpenRegisterForm = () => setOpenegisterForm((cur) => !cur);

  const handleOpenLoginForm = () => setOpenLoginForm((cur) => !cur);

  const handleLogout = async () => {
    try {
      const response = await logout({ refreshToken });
      if (response && response.data && response.data.success) {
        dispatch(logOut());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#212f3f] h-full">
      <div className="border-b-2 border-gray-300 h-full w-full flex items-center justify-between px-[110px]">
        <div className="p-0 flex-1 h-full w-full flex items-center gap-5 text-white">
          <img
            className="h-14 w-14 rounded-lg object-cover"
            src={images.logo}
            alt=""
          />
          {navbarItems.map((item) => {
            return (
              <div className="" key={item.id}>
                <Link to={item.path} className="text-white font-bold uppercase">
                  {item.title}
                </Link>
              </div>
            );
          })}
        </div>
        {!isLoggedIn ? (
          <div className="flex-1 flex items-center gap-3 justify-end">
            <>
              <Button onClick={handleOpenRegisterForm} variant="outlined">
                Đăng ký
              </Button>
              <RegisterForm
                open={openRegisterForm}
                handleOpen={handleOpenRegisterForm}
              />
              <Button variant="filled" onClick={handleOpenLoginForm}>
                Đăng nhập
              </Button>
              <LoginForm
                open={openLoginForm}
                handleOpen={handleOpenLoginForm}
              />
              <Button variant="filled">Kênh nhà tuyển dụng</Button>
            </>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <IconButton className="shadow-none p-3 rounded-full bg-green-50 text-green-900 ">
              <icons.PiBellRingingFill size={20} />
            </IconButton>
            <Link to="/messenger">
              <IconButton className="shadow-none p-3 rounded-full bg-green-50 text-green-900">
                <icons.BsMessenger size={20} />
              </IconButton>
            </Link>
            <IconButton className="shadow-none p-3 rounded-full bg-green-50 text-green-900">
              <icons.IoBookmark size={20} />
            </IconButton>
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  className="text-base font-normal capitalize tracking-normal shadow-none active:shadow-none flex items-center gap-2 p-2 rounded-full bg-[#0891b2] cursor-pointer hover:bg-[#06b6d4] active:bg-[#06b6d4] transition-all"
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
