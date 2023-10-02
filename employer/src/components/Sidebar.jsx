import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { icons } from "../utils/icons";
import { Link } from "react-router-dom";
import { useLogOutMutation } from "../redux/features/apis/authApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authSelect, logOut } from "../redux/features/slices/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { refreshToken, user } = useSelector(authSelect);

  const [logout, { isLoading }] = useLogOutMutation();

  const [openJobMenu, setOpenJobMenu] = useState(true);
  const [openResumeMenu, setOpenResumeMenu] = useState(true);
  const [openSettingMenu, setOpenSettingMenu] = useState(true);

  const handleOpenJobMenu = () => {
    setOpenJobMenu(!openJobMenu);
  };

  const handleOpenResumeMenu = () => {
    setOpenResumeMenu(!openResumeMenu);
  };

  const handleOpenSettingMenu = () => {
    setOpenSettingMenu(!openSettingMenu);
  };

  const handleLogoutEmployer = async () => {
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

  console.log(user);

  return (
    <Card className="h-screen w-full shadow-none rounded-none border-r border-blue-gray-100 ">
      <div className="flex items-center gap-2 p-[6px] bg-light-blue-50 mx-4 my-2 rounded-md">
        <img
          src={user?.ownerEmployerId?.companyLogo}
          alt={user?.ownerEmployerId?.companyName}
          className="h-11 w-18 object-cover rounded-md"
        />
        <div className="">
          <Typography className="text-xs font-medium text-black">
            {user?.ownerEmployerId?.companyName}
          </Typography>
          <Typography className="text-xs font-medium text-black">
            {user?.ownerEmployerId?.companyEmail}
          </Typography>
          <Typography className="text-xs font-medium text-black">
            84+ {user?.ownerEmployerId?.companyPhoneNumber}
          </Typography>
        </div>
      </div>
      <hr className=" border-blue-gray-100" />
      <List className="p-4 text-sm">
        <Link to="/dashboard">
          <ListItem>
            <ListItemPrefix>
              <icons.BsBarChartLineFill size={20} />
            </ListItemPrefix>
            Dashboard
          </ListItem>
        </Link>
        <hr className="my-2 border-blue-gray-100" />
        <Accordion
          open={openJobMenu}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openJobMenu ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openJobMenu}>
            <AccordionHeader
              onClick={handleOpenJobMenu}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <icons.IoBriefcase size={20} />
              </ListItemPrefix>
              <Typography className="mr-auto text-sm">
                Chiến dịch tuyển dụng
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/list-jobs">
                <ListItem className="text-sm">
                  <ListItemPrefix>
                    <icons.MdKeyboardArrowRight size={20} />
                  </ListItemPrefix>
                  Quản lý tin tuyển dụng
                </ListItem>
              </Link>
              <Link to="/create-recruitment-job">
                <ListItem className="text-sm">
                  <ListItemPrefix>
                    <icons.MdKeyboardArrowRight size={20} />
                  </ListItemPrefix>
                  Thêm tin tuyển dụng
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion
          open={openResumeMenu}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openResumeMenu ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openResumeMenu}>
            <AccordionHeader
              onClick={handleOpenResumeMenu}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <icons.HiDocumentText size={20} />
              </ListItemPrefix>
              <Typography className="mr-auto text-sm">
                Hồ sơ & CV ứng tuyển
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem className="text-sm">
                <ListItemPrefix>
                  <icons.MdKeyboardArrowRight size={20} />
                </ListItemPrefix>
                Quản lý CV
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <hr className="my-2 border-blue-gray-100" />
        <Link to="/message">
          <ListItem>
            <ListItemPrefix>
              <icons.BsMessenger size={20} />
            </ListItemPrefix>
            Tin nhắn
          </ListItem>
        </Link>
        <Accordion
          open={openSettingMenu}
          icon={
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`mx-auto h-4 w-4 transition-transform ${
                openSettingMenu ? "rotate-180" : ""
              }`}
            />
          }
        >
          <ListItem className="p-0" selected={openSettingMenu}>
            <AccordionHeader
              onClick={handleOpenSettingMenu}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <icons.IoSettingsSharp size={20} />
              </ListItemPrefix>
              <Typography className="mr-auto text-sm">
                Cài đặt tài khoản
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/user-profile">
                <ListItem className="text-sm">
                  <ListItemPrefix>
                    <icons.MdKeyboardArrowRight size={20} />
                  </ListItemPrefix>
                  Thông tin cá nhân
                </ListItem>
              </Link>
              <Link to="/company-profile">
                <ListItem className="text-sm">
                  <ListItemPrefix>
                    <icons.MdKeyboardArrowRight size={20} />
                  </ListItemPrefix>
                  Thông tin công ty
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem onClick={handleLogoutEmployer}>
          <ListItemPrefix>
            <icons.IoLogOutOutline size={20} />
          </ListItemPrefix>
          Đăng xuất
        </ListItem>
      </List>
    </Card>
  );
};

export default Sidebar;
