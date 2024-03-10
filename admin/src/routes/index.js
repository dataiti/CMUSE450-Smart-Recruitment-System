import { Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout, ChatbotLayout } from "../layouts";
import {
  LoginPage,
  DashboardPage,
  ManageCategory,
  ManageJob,
  ManageTransaction,
  ManageEmployer,
  ManageUser,
  CreateEmployer,
  NLUTrainingPage,
  StoriesTrainingPage,
  DomainTraningPage,
  RulesTrainingPage,
} from "../pages";
import { ProtectedRoutes } from "../components/shares";

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
    element: <ChatbotLayout />,
    children: [
      {
        path: "training-stories",
        element: <StoriesTrainingPage />,
        index: true,
      },
      {
        path: "training-nlu",
        element: <NLUTrainingPage />,
      },
      {
        path: "training-domain",
        element: <DomainTraningPage />,
      },
      {
        path: "training-rules",
        element: <RulesTrainingPage />,
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
