import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { menuItems } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { authSelect, logOut } from "../../redux/features/slices/authSlice";
import { useLogOutMutation } from "../../redux/features/apis/authApi";
import { icons } from "../../utils/icons";
import { SwitchCustom } from "../shares";

const SidebarProfile = () => {
  const dispatch = useDispatch();
  const { user, refreshToken } = useSelector(authSelect);

  const [logout] = useLogOutMutation();

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
    <Card className="h-[calc(100vh-110px)] w-[19rem] p-2 shadow-xl shadow-blue-gray-900/5 bg-white">
      <div className="flex flex-col gap-2 p-5">
        <div className="flex justify-center">
          <Avatar
            src={user?.avatar}
            alt="avatar"
            className="w-[100px] h-[100px] p-2 bg-blue-gray-100"
          />
        </div>
        <div className="flex items-center gap-4">
          <icons.FaUserCircle size={24} />
          <Typography className="text-sm font-medium">{`${user?.lastName} ${user?.firstName}`}</Typography>
        </div>
        <div className="flex items-center gap-4">
          <icons.MdEmail size={24} />
          <Typography className="text-sm font-medium">{user?.email}</Typography>
        </div>
        {user?.phone && (
          <div className="flex items-center gap-4">
            <icons.FaUserCircle />
            <Typography className="text-sm font-medium">
              {user?.phone}
            </Typography>
          </div>
        )}
        <SwitchCustom checked={true} />
      </div>
      <hr className="my-1 border-gray-400" />
      <List>
        <ul className="col-span-4 flex w-full flex-col gap-1">
          {menuItems.map(({ id, title, icon, path }) => (
            <li key={id}>
              <Link to={path}>
                <ListItem>
                  <ListItemPrefix className="flex items-center gap-4">
                    {icon}
                    <Typography
                      color="blue-gray"
                      className="mb-1 text-sm font-bold"
                    >
                      {title}
                    </Typography>
                  </ListItemPrefix>
                </ListItem>
              </Link>
            </li>
          ))}
          <li>
            <ListItem onClick={handleLogout}>
              <ListItemPrefix className="flex items-center gap-4">
                <icons.IoLogOutOutline size={24} />
                <Typography
                  color="blue-gray"
                  className="mb-1 text-sm font-bold"
                >
                  Đăng xuất
                </Typography>
              </ListItemPrefix>
            </ListItem>
          </li>
        </ul>
      </List>
    </Card>
  );
};

export default SidebarProfile;
