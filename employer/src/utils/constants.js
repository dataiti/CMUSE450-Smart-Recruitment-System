import { icons } from "../utils/icons";
import { images } from "../assets/images";

export const CVTemplates = [
  {
    id: 1,
    name: "Cascade",
    path: images.cascade,
  },
  {
    id: 2,
    name: "Decker",
    path: images.decker,
  },
  {
    id: 3,
    name: "Iconic",
    path: images.iconic,
  },
  {
    id: 4,
    name: "Simple",
    path: images.simple,
  },
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

export const menuItems = [
  {
    id: 1,
    path: "/profile",
    title: "Cài đặt thông tin cá nhân",
    icon: <icons.FiEdit size={20} />,
  },
  {
    id: 2,
    path: "/candidate",
    title: "Trở thành ứng viên",
    icon: <icons.IoBriefcaseOutline size={20} />,
  },
  {
    id: 3,
    path: "/schedule-interview",
    title: "Lịch trình",
    icon: <icons.BsCalendar3 size={20} />,
  },
  {
    id: 4,
    path: "/meeting",
    title: "Cuộc họp",
    icon: <icons.HiOutlineVideoCamera size={20} />,
  },
  {
    id: 5,
    path: "/change-password",
    title: "Đổi mật khẩu",
    icon: <icons.IoKeyOutline size={24} />,
  },
];

export const experiens = [
  { id: 1, value: "Chưa có kinh nghiệm" },
  { id: 2, value: "Dưới 1 năm" },
  { id: 3, value: "1 năm" },
  { id: 4, value: "2 năm" },
  { id: 5, value: "3 năm" },
  { id: 6, value: "4 năm" },
  { id: 7, value: "5 năm" },
  { id: 8, value: "Trên 5 năm" },
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

export const companyIndustryOptions = [
  { id: 1, value: "Phát triển phần mềm" },
  { id: 2, value: "An ninh mạng" },
  { id: 3, value: "Quản trị hệ thống" },
  { id: 4, value: "Thiết kế giao diện người dùng" },
  { id: 5, value: "Học máy và Trí tuệ nhân tạo" },
  { id: 6, value: "Quản lý dự án phần mềm" },
  { id: 7, value: "Lập trình di động" },
];

export const jobTypeOptions = [
  { id: 1, value: "Toàn thời gian" },
  { id: 2, value: "Bán thời gian" },
  { id: 3, value: "Thực tập" },
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
  { id: 1, value: "Nhân viên" },
  { id: 2, value: "Trưởng nhóm" },
  { id: 3, value: "Trưởng / Phó phòng" },
  { id: 4, value: "Quản lý / Giám sát" },
  { id: 5, value: "Trưởng chi nhánh" },
  { id: 6, value: "Phó giám đốc" },
  { id: 7, value: "Giám đốc" },
  { id: 8, value: "Thực tập sinh" },
];

export const tableHeadJob = [
  { id: 1, name: "" },
  { id: 2, name: "ID" },
  { id: 3, name: "Tên chiến dịch" },
  { id: 4, name: "Tên công việc" },
  { id: 5, name: "Ngành nghề" },
  { id: 6, name: "Đã ứng tuyển" },
  { id: 7, name: "Ngày đăng" },
  { id: 8, name: "Trạng thái" },
  { id: 9, name: "Hành động" },
];

export const tableHeadApplyJob = [
  { id: 1, name: "ID" },
  { id: 2, name: "Thông tin ứng cử viên" },
  { id: 3, name: "Tên chiến dịch" },
  { id: 4, name: "Tên CV" },
  { id: 5, name: "Ngày đăng" },
  { id: 6, name: "Trạng thái" },
  { id: 7, name: "Hành động" },
];

export const tableHeadApplyJobDashboard = [
  { id: 1, name: "ID" },
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
  { id: 2, text: "Theo danh mục việc làm", value: "category" },
  { id: 2, text: "Theo Tỉnh/Thành phố", value: "workRegion" },
  { id: 2, text: "Theo loại công việc", value: "jobType" },
];

export const recruitmentChatData = [
  {
    type: "text",
    message: "Chào bạn, bạn đang quan tâm đến vị trí tuyển dụng nào?",
    incoming: true,
    outgoing: false,
  },
  {
    type: "text",
    message: "Chào bạn, tôi quan tâm đến vị trí phát triển phần mềm.",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    message:
      "Rất tốt, chúng tôi hiện đang có một số vị trí phù hợp. Bạn đã có kinh nghiệm làm việc trong lĩnh vực này chưa?",
    incoming: true,
    outgoing: false,
  },
  {
    type: "text",
    message: "Có, tôi đã có 2 năm kinh nghiệm trong phát triển phần mềm.",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    message:
      "Rất tốt, chúng tôi sẽ cần một bản CV của bạn để tiến hành xem xét. Bạn có thể gửi nó cho chúng tôi được không?",
    incoming: true,
    outgoing: false,
  },
  {
    type: "text",
    message: "Tất nhiên, tôi sẽ gửi bản CV của mình ngay.",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    message:
      "Cảm ơn bạn, chúng tôi sẽ xem xét và liên hệ lại trong thời gian sớm nhất.",
    incoming: true,
    outgoing: false,
  },
];

export const fakeChatListData = [
  {
    id: 1,
    name: "Anh Thắng",
    avatar:
      "https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg",
    lastMessage: "Chào bạn, bạn khỏe không?",
    lastMessageTime: "10:30 AM",
  },
  {
    id: 2,
    name: "Đạt",
    avatar:
      "https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg",
    lastMessage: "Có phải bạn đã nhận được email của tôi?",
    lastMessageTime: "Hôm qua",
  },
  {
    id: 3,
    name: "Anh Khoa",
    avatar:
      "https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg",
    lastMessage: "Không có gì đáng ngạc nhiên cả!",
    lastMessageTime: "Hôm qua",
  },
  {
    id: 4,
    name: "Minh Quang",
    avatar:
      "https://res.cloudinary.com/doo78f14s/image/upload/v1677427616/CDIO2-project/dedault_jd3qnu.jpg",
    lastMessage: "Tôi đã xem xét hồ sơ của bạn.",
    lastMessageTime: "2 ngày trước",
  },
];

export const thongsodata = [
  { id: 1, value: 0, name: "Số công việc" },
  { id: 2, value: 0, name: "Số CV ứng tuyển" },
  { id: 3, value: 0, name: "Số CV mới" },
  { id: 4, value: 0, name: "Người theo dõi" },
  { id: 5, value: 0, name: "DCMMM" },
];
