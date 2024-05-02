import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useLogOutMutation } from "../../redux/features/apis/authApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authSelect, logOut } from "../../redux/features/slices/authSlice";
import { sidebarItems } from "../../utils/constants";
import { images } from "../../assets/images";
import { ButtonCustom, IconButtonCustom, Loading } from "../shares";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { refreshToken } = useSelector(authSelect);

  const [indexSidebar, setIndexSidebar] = useState(1);

  const [logout, { isLoading }] = useLogOutMutation();

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
    <div className="h-full overflow-y-auto w-full bg-[#020617]">
      {isLoading && <Loading />}
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="py-6 flex flex-col items-center justify-center gap-3">
          <img
            src={images.logo}
            alt=""
            className="rounded-full w-32 border-4 border-green-500"
          />
          <Typography className="text-white text-xs">
            Smart Recruitment System
          </Typography>
        </div>
        <div className="flex flex-col ">
          {sidebarItems.map((item) => {
            return item.path ? (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-2 w-full p-2 rounded-md ${
                  indexSidebar === item.id ? "bg-[#1e293b]" : "bg-transparent"
                }`}
                onClick={() => setIndexSidebar(item.id)}
              >
                <IconButtonCustom className="rounded-md">
                  {item.icon}
                </IconButtonCustom>
                <Typography className="text-white uppercase text-xs font-bold">
                  {item.title}
                </Typography>
              </Link>
            ) : (
              <ButtonCustom
                onClick={handleLogout}
                key={item.id}
                className="flex items-center rounded-full mt-10"
              >
                {item.icon}
                <Typography className="text-white uppercase text-xs font-bold">
                  {item.title}
                </Typography>
              </ButtonCustom>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
