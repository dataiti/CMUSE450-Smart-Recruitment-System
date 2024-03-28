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
  NLU,
  Domain,
  Rules,
  Stories,
  Response,
  TalkYourBot,
  Conversation,
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
        path: "/rasa/talk-to-your-bot",
        element: <TalkYourBot />,
        index: true,
      },
      {
        path: "/rasa/conversations",
        element: <Conversation />,
      },
      {
        path: "training-stories",
        element: <Stories />,
      },
      {
        path: "training-nlu",
        element: <NLU />,
      },
      {
        path: "training-domain",
        element: <Domain />,
      },
      {
        path: "training-rules",
        element: <Rules />,
      },
      {
        path: "training-response",
        element: <Response />,
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
