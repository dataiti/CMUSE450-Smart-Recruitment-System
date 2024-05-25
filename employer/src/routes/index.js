import { Navigate } from "react-router-dom";
import { AuthLayout, DashboardLayout } from "../layouts";
import {
  CompanyProfilePage,
  CreateRecruitmentJobPage,
  DashboardPage,
  ListJobsPage,
  LoginPage,
  MessagePage,
  RegisterEmployerPage,
  RegisterPage,
  UserProfilePage,
  PaymentPage,
  DecorationPage,
  RecruitProcessPage,
  MySchedulePage,
  SearchCandidatePage,
} from "../pages";
import { ProtectedRoutes } from "../components/shares";
import ListResumes from "../pages/resume/ListResumes";

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
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/register-employer",
        element: <RegisterEmployerPage />,
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
            path: "/list-jobs",
            element: <ListJobsPage />,
          },
          {
            path: "/list-resumes",
            element: <ListResumes />,
          },
          {
            path: "/cv-processing/:applyJobId",
            element: <RecruitProcessPage />,
          },
          {
            path: "/my-schedule",
            element: <MySchedulePage />,
          },
          {
            path: "/create-recruitment-job",
            element: <CreateRecruitmentJobPage />,
          },
          {
            path: "/message",
            element: <MessagePage />,
          },
          {
            path: "/decoration",
            element: <DecorationPage />,
          },
          {
            path: "/payment",
            element: <PaymentPage />,
          },
          {
            path: "/company-profile",
            element: <CompanyProfilePage />,
          },
          {
            path: "/user-profile",
            element: <UserProfilePage />,
          },
          {
            path: "/search-candidate",
            element: <SearchCandidatePage />,
          },
        ],
      },
    ],
  },
];

export default routers;
