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
  JobDetailPage,
  WishListPage,
  CompanyProfile,
  ListMyApplyJobs,
  JobRecommendationPage,
  SearchJobPage,
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
      {
        path: "/categories-job",
        element: <CategoriesPage />,
      },
      {
        path: "/search-job",
        element: <SearchJobPage />,
      },
      {
        path: "/job-detail/:jobId",
        element: <JobDetailPage />,
      },
      {
        path: "/recommender-job",
        element: <JobRecommendationPage />,
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
            path: "/wishlist",
            element: <WishListPage />,
          },
          {
            path: "/company-profile/:companyId",
            element: <CompanyProfile />,
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
          {
            path: "/manage-jobapply",
            element: <ListMyApplyJobs />,
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
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/resume-online",
        element: <ResumeOnlinePage />,
      },
    ],
  },
];

export default routers;
