import { MainLayout, MessengerLayout, ProfileLayout } from "../layouts";
import {
  HomePage,
  CategoriesPage,
  MessagePage,
  ChangePasswordPage,
  EditProfilePage,
  MyCalendarPage,
  RegisterCandidatePage,
  ResumeOnlinePage,
} from "../pages";
import ProtectedRoutes from "../components/ProtectedRoutes";

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
            path: "/categories-job",
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
