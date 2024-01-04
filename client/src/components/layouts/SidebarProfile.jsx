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
import {
  authSelect,
  logOut,
  updateApplyAuto,
} from "../../redux/features/slices/authSlice";
import { useLogOutMutation } from "../../redux/features/apis/authApi";
import { icons } from "../../utils/icons";
import { useToggleApplyAutoMutation } from "../../redux/features/apis/candidateApi";
import { SwitchCustom } from "../shares";

const SidebarProfile = () => {
  const dispatch = useDispatch();
  const { user, refreshToken } = useSelector(authSelect);

  const [logout] = useLogOutMutation();
  const [toggleApplyAuto] = useToggleApplyAutoMutation();

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

  const handleToggleSwitchApplyAuto = async ({ _id }) => {
    try {
      const response = await toggleApplyAuto({
        userId: user?._id,
        candidateId: _id,
      });
      if (response && response.data && response.data.success) {
        dispatch(updateApplyAuto(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="h-[calc(100vh-110px)] w-[310px] p-2 shadow-xl shadow-blue-gray-900/5 bg-white">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex justify-center">
          <Avatar
            src={user?.avatar}
            alt="avatar"
            className="w-[100px] h-[100px] p-2 bg-blue-gray-100"
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-500 bg-green-50 p-2 rounded-full">
            <icons.FaUserCircle size={18} />
          </span>
          <Typography className="text-sm font-bold">{`${user?.lastName} ${user?.firstName}`}</Typography>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-500 bg-green-50 p-2 rounded-full">
            <icons.MdEmail size={18} />
          </span>
          <Typography className="text-sm font-bold">{user?.email}</Typography>
        </div>
        {user?.phone && (
          <div className="flex items-center gap-4">
            <span className="text-green-500 bg-green-50 p-2 rounded-full">
              <icons.FaUserCircle size={18} />
            </span>
            <Typography className="text-sm font-bold">{user?.phone}</Typography>
          </div>
        )}
        {user?.candidateId && (
          <>
            <div className="flex items-center gap-2">
              <SwitchCustom
                isChecked={user?.candidateId?.isApplyAuto}
                onChange={() =>
                  handleToggleSwitchApplyAuto({ _id: user?.candidateId?._id })
                }
              />
              <Typography className="text-sm font-bold">
                {`Đang ${
                  user?.candidateId?.isApplyAuto ? "Bật" : "Tắt"
                } tự động ứng tuyển`}
              </Typography>
            </div>
            <Typography className="text-xs text-gray-600 font-semibold">
              Bật tìm việc giúp hồ sơ của bạn nổi bật hơn và được chú ý nhiều
              hơn trong danh sách tìm kiếm của NTD.
            </Typography>
          </>
        )}
      </div>
      <hr className="border-gray-400" />
      <List>
        <ul className="col-span-4 flex w-full flex-col">
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
