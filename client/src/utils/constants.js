import { icons } from "../utils/icons";

export const loyaltyProgramItem = [
  {
    display: "Cơ hội việc làm",
    subDisplay: "Đa dạng vị trí công việc IT",
    icon: <icons.FaBriefcase size={24} />,
  },
  {
    display: "Thương hiệu uy tín",
    subDisplay: "Lựa chọn từ các công ty hàng đầu",
    icon: <icons.FaStar size={24} />,
  },
  {
    display: "Hỗ trợ 24/7",
    subDisplay: "Luôn sẵn sàng giúp đỡ",
    icon: <icons.FaHeadphonesAlt size={24} />,
  },
  {
    display: "Lương cạnh tranh",
    subDisplay: "Thanh toán hấp dẫn",
    icon: <icons.FaDollarSign size={24} />,
  },
  {
    display: "Bảo mật thông tin",
    subDisplay: "Bảo vệ thông tin cá nhân",
    icon: <icons.FaLock size={24} />,
  },
];

export const menuCVItems = [
  {
    id: 1,
    path: "/",
    icon: <icons.HiHome size={20} />,
    name: "Trang chủ",
  },
  {
    id: 2,
    type: "template",
    icon: <icons.HiDocumentText size={20} />,
    name: "Mẫu CV",
  },
  {
    id: 3,
    type: "color",
    icon: <icons.MdColorLens size={20} />,
    name: "Màu sắc",
  },
];

export const sidebarItems = [
  {
    id: 1,
    path: "/",
    icon: <icons.HiHome size={20} />,
    name: "Trang chủ",
  },
  {
    id: 2,
    path: "/categories-job",
    icon: <icons.IoBriefcase size={20} />,
    name: "Việc làm",
  },
  {
    id: 3,
    path: "/resume-online",
    icon: <icons.HiDocumentText size={20} />,
    name: "CV",
  },
  {
    id: 4,
    path: "/company",
    icon: <icons.HiHome size={20} />,
    name: "Công ty",
  },
];

export const navbarBlogItems = [
  {
    id: 1,
    icon: <icons.HiHome size={24} />,
    path: "/",
    name: "Trang chủ",
  },
  {
    id: 2,
    icon: <icons.FaBriefcase size={24} />,
    path: "/categories-job",
    name: "Danh mục công việc",
  },

  {
    id: 3,
    icon: <icons.BsFileTextFill size={24} />,
    path: "/resume-online",
    name: "Hồ sơ & CV",
  },
  {
    id: 4,
    icon: <icons.BsMessenger size={24} />,
    path: "/messenger",
    name: "Tin nhắn",
  },
  {
    id: 5,
    icon: <icons.IoBookmark size={24} />,
    path: "/wishlist",
    name: "Yêu thích",
  },
  {
    id: 6,
    icon: <icons.FaUserAlt size={24} />,
    path: "/profile",
    name: "Cá nhân",
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
    id: 5,
    path: "/change-password",
    title: "Đổi mật khẩu",
    icon: <icons.IoKeyOutline size={24} />,
  },
  {
    id: 6,
    path: "/manage-jobapply",
    title: "Quản lý ứng tuyển",
    icon: <icons.ImTable2 size={20} />,
  },
];

export const navbarItems = [
  {
    id: 1,
    path: "/",
    title: "Trang chủ",
  },
  {
    id: 2,
    title: "Việc làm",
    childrens: [
      {
        id: 1,
        path: "/categories-job",
        title: "Danh mục việc làm",
      },
      {
        id: 2,
        path: "/recommender-job",
        title: "Đề xuất công việc phù hợp",
      },
    ],
  },
  {
    id: 3,
    path: "/resume-online",
    title: "Hồ sơ & CV",
  },
  {
    id: 4,
    path: "/forum",
    title: "Diễn đàn",
  },
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

export const statusOptions = [
  { id: 1, text: "Tất cả", value: "" },
  { id: 2, text: "Chờ phê duyệt", value: "pending" },
  { id: 3, text: "Đang hoạt động", value: "active" },
  { id: 4, text: "Đã hết hạn", value: "expired" },
  { id: 5, text: "Bị từ chối", value: "reject" },
];

export const tableHeadApplyJob = [
  { id: 2, name: "công ty" },
  { id: 3, name: "Tên chiến dịch" },
  { id: 4, name: "Tên CV" },
  { id: 5, name: "Trạng thái" },
  { id: 6, name: "Ngày đăng" },
  { id: 7, name: "Hành động" },
];

export const categoriesBarItems = [
  {
    id: 1,
    display: "Xếp hạng",
    type: "rating",
    icon: <icons.IoBriefcaseOutline size={20} />,
  },
  {
    id: 2,
    display: "Ngành nghề",
    type: "industry",
    icon: <icons.IoBriefcaseOutline size={20} />,
    childrens: [
      { id: 1, value: "Phát triển phần mềm" },
      { id: 2, value: "An ninh mạng" },
      { id: 3, value: "Quản trị hệ thống" },
      { id: 4, value: "Thiết kế giao diện người dùng" },
      { id: 5, value: "Học máy và Trí tuệ nhân tạo" },
      { id: 6, value: "Quản lý dự án phần mềm" },
      { id: 7, value: "Lập trình di động" },
    ],
  },
  {
    id: 4,
    display: "Loại công việc",
    type: "jobType",
    icon: <icons.IoBriefcaseOutline size={20} />,
    childrens: [
      { id: 1, value: "Toàn thời gian" },
      { id: 2, value: "Bán thời gian" },
      { id: 3, value: "Từ xa" },
    ],
  },
  {
    id: 5,
    display: "Cấp bậc",
    type: "level",
    icon: <icons.IoBriefcaseOutline size={20} />,
    childrens: [
      { id: 1, value: "Internship" },
      { id: 2, value: "Fresher" },
      { id: 3, value: "Junior" },
      { id: 4, value: "Middle" },
      { id: 5, value: "Senior" },
      { id: 6, value: "Manager" },
      { id: 7, value: "Khác" },
    ],
  },
  {
    id: 6,
    display: "Kinh nghiệm",
    type: "experience",
    icon: <icons.IoBriefcaseOutline size={20} />,
    childrens: [
      { id: 1, text: "Chưa có kinh nghiệm", value: 0.5 },
      { id: 2, text: "1 năm", value: 1 },
      { id: 3, text: "2 năm", value: 2 },
      { id: 4, text: "3 năm", value: 3 },
      { id: 5, text: "4 năm", value: 4 },
      { id: 6, text: "5 năm", value: 5 },
      { id: 7, text: "Trên 5 năm", value: 6 },
    ],
  },
];

export const sexOptions = [
  { id: 1, value: "Nam" },
  { id: 2, value: "Nữ" },
  { id: 3, value: "Không xác định" },
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

export const experiens = [
  { id: 1, text: "Chưa có kinh nghiệm", value: 0 },
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

export const fakeDataMessage = [
  {
    type: "text",
    message: "Hi 👋🏻, How are ya ?",
    incoming: true,
    outgoing: false,
  },
  {
    type: "media",
    message: "Hi 👋 Panda, not bad, u ?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "reply",
    message: "Can you send me an abstarct image?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    message: "Ya sure, sending you a pic",
    incoming: true,
    outgoing: false,
  },

  {
    type: "text",
    message: "Here You Go",
    incoming: true,
    outgoing: false,
  },
  {
    type: "text",
    message: "Can you please send this in file format?",
    incoming: false,
    outgoing: true,
  },

  {
    type: "text",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "text",
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "text",
    reply: "This is a reply",
    message: "Yep, I can also do that",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    reply: "This is a reply",
    message: "Yep, I can also do that",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    reply: "This is a reply",
    message: "Yep, I can also do that",
    incoming: false,
    outgoing: true,
  },
  {
    type: "text",
    reply: "This is a reply",
    message: "Yep, I can also do that",
    incoming: false,
    outgoing: true,
  },
];

export const colors = [
  { id: 1, backgound: "bg-blue-gray-500", color: "text-blue-gray-500" },
  { id: 2, backgound: "bg-gray-500", color: "text-gray-500" },
  { id: 3, backgound: "bg-brown-500", color: "text-brown-500" },
  { id: 1, backgound: "bg-deep-orange-500", color: "text-deep-orange-500" },
  { id: 1, backgound: "bg-orange-500", color: "text-orange-500" },
  { id: 1, backgound: "bg-yellow-500", color: "text-yellow-500" },
  { id: 1, backgound: "bg-lime-500", color: "text-lime-500" },
  { id: 1, backgound: "bg-light-green-500", color: "text-light-green-500" },
  { id: 1, backgound: "bg-green-500", color: "text-green-500" },
];
