import { Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "../layouts";
import {
  LoginPage,
  DashboardPage,
  ManageCategory,
  ManageJob,
  ManageTransaction,
  ManageEmployer,
  ManageUser,
  CreateEmployer,
} from "../pages";
import ProtectedRoutes from "../components/ProtectedRoutes";

const routers = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        index: true,
      },
    ],
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            element: <Navigate to="/dashboard" replace />,
            index: true,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/category-management",
            element: <ManageCategory />,
          },
          {
            path: "/job-posting-management",
            element: <ManageJob />,
          },
          {
            path: "/transaction-management",
            element: <ManageTransaction />,
          },
          {
            path: "/employer-management",
            element: <ManageEmployer />,
          },
          {
            path: "/user-management",
            element: <ManageUser />,
          },
          {
            path: "/create-employer",
            element: <CreateEmployer />,
          },
        ],
      },
    ],
  },
];

export default routers;
