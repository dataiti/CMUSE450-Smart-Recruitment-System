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

export const sidebarItems = [
  {
    id: 1,
    path: "/",
    icon: <icons.HiHome size={20} />,
    name: "Trang chủ",
  },
  {
    id: 2,
    path: "/categories",
    icon: <icons.IoBriefcase size={20} />,
    name: "Việc làm",
  },
  {
    id: 1,
    path: "/resume-online",
    icon: <icons.HiDocumentText size={20} />,
    name: "CV",
  },
  {
    id: 1,
    path: "/company",
    icon: <icons.HiHome size={20} />,
    name: "Công ty",
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
