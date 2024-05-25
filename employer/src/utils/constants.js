import { icons } from "../utils/icons";

export const menuItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <icons.BsBarChartLineFill size={20} />,
  },
  {
    label: "Chiến dịch tuyển dụng",
    icon: <icons.IoBriefcase size={20} />,
    subItems: [
      { to: "/list-jobs", label: "Quản lý tin tuyển dụng" },
      { to: "/create-recruitment-job", label: "Thêm tin tuyển dụng" },
    ],
  },
  {
    to: "/list-resumes",
    label: "Hồ sơ & CV ứng tuyển",
    icon: <icons.HiDocumentText size={20} />,
  },
  {
    to: "/search-candidate",
    label: "Tìm kiếm ứng viên",
    icon: <icons.HiDocumentText size={20} />,
  },
  {
    to: "/message",
    label: "Tin nhắn",
    icon: <icons.BsMessenger size={20} />,
  },
  {
    to: "/my-schedule",
    label: "Lịch trình",
    icon: <icons.BsCalendar3 size={20} />,
  },
  {
    to: "/payment",
    label: "Nâng cấp gói",
    icon: <icons.MdPayment size={20} />,
  },
  {
    to: "/company-profile",
    label: "Thông tin công ty",
    icon: <icons.IoSettingsSharp size={20} />,
  },
];

export const orderByOptions = [
  { id: 1, text: "Tăng dần", value: "asc" },
  { id: 2, text: "Giảm dần", value: "desc" },
];

export const sortByOptions = [
  { id: 1, text: "Mới nhất", value: "createdAt" },
  { id: 2, text: "Độ phù hợp", value: "percentage" },
  { id: 3, text: "Tên công việc", value: "recruitmentTitle" },
];

export const sexOptions = [
  {
    id: 1,
    value: "Nam",
  },
  {
    id: 2,
    value: "Nữ",
  },
  {
    id: 3,
    value: "Không  yêu cầu",
  },
];

export const typeMeetingOptions = [
  {
    id: 1,
    text: "Offline",
    value: "offline",
  },
  {
    id: 2,
    text: "Online",
    value: "online",
  },
];

export const experiens = [
  { id: 1, text: "Chưa có kinh nghiệm", value: 0.5 },
  { id: 2, text: "1 năm", value: 1 },
  { id: 3, text: "2 năm", value: 2 },
  { id: 4, text: "3 năm", value: 3 },
  { id: 5, text: "4 năm", value: 4 },
  { id: 6, text: "5 năm", value: 5 },
  { id: 7, text: "Trên 5 năm", value: 6 },
];

export const desiredSalarys = [
  { id: 1, value: "Dưới 10 triệu" },
  { id: 2, value: "10 - 15 triệu" },
  { id: 3, value: "15 - 20 triệu" },
  { id: 4, value: "20 - 25 triệu" },
  { id: 5, value: "25 - 30 triệu" },
  { id: 6, value: "30 - 50 triệu" },
  { id: 7, value: "Trên 50 triệu" },
  { id: 8, value: "Thỏa thuận" },
];

export const desiredSalaryOptions = [
  { id: 1, value: "Dưới 10 triệu", salaryFrom: 0, salaryTo: 10000000 },
  { id: 2, value: "10 - 15 triệu", salaryFrom: 10000000, salaryTo: 15000000 },
  { id: 3, value: "15 - 20 triệu", salaryFrom: 15000000, salaryTo: 20000000 },
  { id: 4, value: "20 - 25 triệu", salaryFrom: 20000000, salaryTo: 25000000 },
  { id: 5, value: "25 - 30 triệu", salaryFrom: 25000000, salaryTo: 30000000 },
  { id: 6, value: "30 - 50 triệu", salaryFrom: 30000000, salaryTo: 50000000 },
  {
    id: 7,
    value: "Trên 50 triệu",
    salaryFrom: 50000000,
    salaryTo: Number.MAX_VALUE,
  },
  { id: 8, value: "Thỏa thuận" },
];

export const statusOptions = [
  { id: 1, text: "Chờ phê duyệt", value: "pending" },
  { id: 2, text: "Đang hoạt động", value: "active" },
  { id: 3, text: "Đã hết hạn", value: "expired" },
  { id: 4, text: "Bị từ chối", value: "reject" },
];

export const companySizesOptions = [
  { id: 1, value: "1 - 9 nhân viên" },
  { id: 2, value: "10 - 24 nhân viên" },
  { id: 3, value: "25 - 99 nhân viên" },
  { id: 4, value: "100 - 499 nhân viên" },
  { id: 5, value: "500 - 1000 nhân viên" },
  { id: 6, value: "1000+ nhân viên" },
  { id: 7, value: "3000+ nhân viên" },
  { id: 8, value: "5000+ nhân viên" },
];

export const jobPositionOptions = [
  { id: 1, value: "Front-end Developer" },
  { id: 2, value: "Back-end Developer" },
  { id: 3, value: "Full-stack Developer" },
  { id: 5, value: "Game Developer" },
  { id: 6, value: "UI/UX Designer" },
  { id: 14, value: "Project Manager" },
  { id: 15, value: "Scrum Master" },
  { id: 17, value: "Data Analyst" },
  { id: 21, value: "Tester" },
  { id: 24, value: "DevOps Engineer" },
  { id: 25, value: "Systems Analyst" },
  { id: 26, value: "Business Analyst" },
  { id: 29, value: "iOS Developer" },
  { id: 30, value: "Android Developer" },
  { id: 31, value: "Khác" },
];

export const companyIndustryOptions = [
  { id: 1, value: "Phát triển phần mềm" },
  { id: 2, value: "Gia công phần mềm" },
  { id: 3, value: "Trí tuệ nhân tạo (AI)" },
  { id: 4, value: "Blockchain" },
  { id: 5, value: "Dịch vụ đám mây (Cloud)" },
  { id: 6, value: "Internet of Things (IoT)" },
  { id: 7, value: "Tư vấn công nghệ" },
  { id: 8, value: "Khác" },
];

export const jobTypeOptions = [
  { id: 1, value: "Toàn thời gian" },
  { id: 2, value: "Bán thời gian" },
  { id: 3, value: "Từ xa" },
];

export const currencyTypeOptions = [
  { id: 1, value: "VND" },
  { id: 2, value: "USD" },
];

export const salaryTypeOptions = [
  { id: 1, value: "Trong khoảng" },
  { id: 2, value: "Từ" },
  { id: 3, value: "Đến" },
  { id: 4, value: "Thỏa thuận" },
];

export const levelOptions = [
  { id: 1, value: "Internship" },
  { id: 2, value: "Fresher" },
  { id: 3, value: "Junior" },
  { id: 4, value: "Middle" },
  { id: 5, value: "Senior" },
  { id: 6, value: "Manager" },
  { id: 7, value: "Khác" },
];

export const tableHeadJob = [
  { id: 1, name: "" },
  { id: 3, name: "Tên chiến dịch" },
  { id: 4, name: "Tên công việc" },
  { id: 5, name: "Ngành nghề" },
  { id: 6, name: "Đã ứng tuyển" },
  { id: 7, name: "Ngày đăng" },
  { id: 8, name: "Trạng thái" },
  { id: 9, name: "Hành động" },
];

export const tableHeadApplyJob = [
  { id: 2, name: "Thông tin ứng cử viên" },
  { id: 3, name: "Tên công việc" },
  { id: 4, name: "Tên CV" },
  { id: 5, name: "Trạng thái" },
  { id: 6, name: "Ngày ứng tuyển" },
  { id: 7, name: "Độ phù hợp" },
  { id: 8, name: "Hành động" },
];

export const tableHeadApplyJobDashboard = [
  { id: 2, name: "Thông tin ứng cử viên" },
  { id: 3, name: "Tên chiến dịch" },
  { id: 4, name: "Tên CV" },
  { id: 6, name: "Trạng thái" },
];

export const typeTimeChartOptions = [
  { id: 1, text: "Hôm nay", value: "day" },
  { id: 2, text: "Tuần nay", value: "week" },
  { id: 3, text: "Tháng nay", value: "month" },
  { id: 4, text: "Năm nay", value: "year" },
];

export const typeChartRowOptions = [
  { id: 1, text: "Theo ứng tuyển", value: "applicated" },
  { id: 2, text: "Theo công việc", value: "job" },
];

export const typeChartPercentOptions = [
  { id: 1, text: "Theo ngành nghề", value: "industry" },
  { id: 2, text: "Theo Tỉnh/Thành phố", value: "workRegion" },
  { id: 3, text: "Theo loại công việc", value: "jobType" },
];

export const statusApplyJobOptions = [
  { id: 1, text: "Tất cả", value: "" },
  { id: 1, text: "Từ chối", value: "rejected" },
  { id: 1, text: "Đã phản hồi", value: "invited" },
  { id: 2, text: "Trong tiến độ", value: "progressing" },
  { id: 3, text: "Đã vỏng phấn", value: "interviewed" },
];

export const premiumPackageData = [
  {
    id: 1,
    title: "Xác Nhận Doanh Nghiệp",
    description:
      "Nhận được 'tick xanh' hoặc biểu tượng xác nhận doanh nghiệp trên hồ sơ của bạn, tăng tính minh bạch và độ tin cậy trong mắt ứng viên.",
  },
  {
    id: 2,
    title: "Ưu tiên Hiển Thị",
    description:
      "Các công việc của bạn sẽ được ưu tiên hiển thị trước trên trang tìm kiếm, giúp thu hút sự chú ý từ ứng viên.",
  },
  {
    id: 3,
    title: "Trang Tuyển Dụng Tùy Chỉnh",
    description:
      "Tạo trang tuyển dụng riêng biệt với nhiều tùy chọn tùy chỉnh hơn, giúp tăng tính chuyên nghiệp.",
  },
  {
    id: 4,
    title: "Đăng Tin Tuyển Không Giới Hạn",
    description:
      "Bạn có khả năng đăng bất kỳ số lượng công việc nào mà bạn cần, mà không bị hạn chế bởi giới hạn số lượng tin đăng.",
  },
];

export const thongsodata = [
  { id: 1, value: 0, name: "Số công việc" },
  { id: 2, value: 0, name: "Số CV ứng tuyển" },
  { id: 3, value: 0, name: "Số CV mới" },
  { id: 4, value: 0, name: "Người theo dõi" },
  { id: 5, value: 0, name: "DCMMM" },
];
