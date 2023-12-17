import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { icons } from "../../utils/icons";
import { Link } from "react-router-dom";
import { useLogOutMutation } from "../../redux/features/apis/authApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authSelect, logOut } from "../../redux/features/slices/authSlice";
import { Loading } from "../shares";
import { menuItems } from "../../utils/constants";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { refreshToken, user } = useSelector(authSelect);

  const [logout, { isLoading }] = useLogOutMutation();
  const [openJobMenu, setOpenJobMenu] = useState(true);

  const handleOpenJobMenu = () => {
    setOpenJobMenu(!openJobMenu);
  };

  const handleLogoutEmployer = async () => {
    try {
      const response = await logout({ refreshToken });
      if (response?.data?.success) {
        dispatch(logOut());
        toast.success("Đăng xuất thành công !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto w-full shadow-none rounded-none border-r border-blue-gray-100 bg-white">
      {isLoading && <Loading />}
      <div className="flex items-center gap-2 p-[6px] bg-light-blue-50 mx-4 my-2 rounded-md">
        <img
          src={user?.ownerEmployerId?.companyLogo}
          alt={user?.ownerEmployerId?.companyName}
          className="h-12 w-18 object-cover rounded-md"
        />
        <div className="">
          <Typography className="text-xs font-bold text-black">
            {user?.ownerEmployerId?.companyName}
          </Typography>
          <Typography className="text-xs font-bold text-black">
            {user?.ownerEmployerId?.companyEmail}
          </Typography>
          <Typography className="text-xs font-bold text-black">
            84+ {user?.ownerEmployerId?.companyPhoneNumber}
          </Typography>
        </div>
      </div>
      <hr className="border-blue-gray-100" />
      <List className="p-3 text-sm font-bold ">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.subItems ? (
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
                    <ListItemPrefix>{item.icon}</ListItemPrefix>
                    <Typography className="mr-auto text-sm font-bold">
                      {item.label}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link key={subIndex} to={subItem.to}>
                        <ListItem className="text-sm font-bold">
                          <ListItemPrefix>
                            <icons.MdKeyboardArrowRight size={20} />
                          </ListItemPrefix>
                          {subItem.label}
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
            ) : (
              <Link to={item.to}>
                <ListItem className="text-sm">
                  <ListItemPrefix>{item.icon}</ListItemPrefix>
                  {item.label}
                </ListItem>
              </Link>
            )}
          </React.Fragment>
        ))}
        <ListItem onClick={handleLogoutEmployer} className="text-sm">
          <ListItemPrefix>
            <icons.FaSignOutAlt size={20} />
          </ListItemPrefix>
          Đăng xuất
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
