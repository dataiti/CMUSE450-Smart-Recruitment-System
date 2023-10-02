import ProtectedRoutes from "../components/ProtectedRoutes";
import { MainLayout } from "../layouts";
import MessengerLayout from "../layouts/MessengerLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import { CategoriesPage, ResumeOnlinePage, HomePage } from "../pages";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import EditProfilePage from "../pages/EditProfilePage";
import MessagePage from "../pages/MessagePage";
import MyCalendarPage from "../pages/MyCalendarPage";
import RegisterCandidatePage from "../pages/RegisterCandidatePage";

const routers = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/categories",
            element: <CategoriesPage />,
          },
          {
            path: "/resume-online",
            element: <ResumeOnlinePage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProfileLayout />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/profile",
            element: <EditProfilePage />,
          },
          {
            path: "/schedule-interview",
            element: <MyCalendarPage />,
          },
          {
            path: "/candidate",
            element: <RegisterCandidatePage />,
          },
          {
            path: "/change-password",
            element: <ChangePasswordPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <MessengerLayout />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/messenger",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
];

export default routers;
