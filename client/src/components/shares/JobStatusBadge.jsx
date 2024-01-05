import React from "react";

const JobStatusBadge = ({ status }) => {
  let backgroundColor, textColor, label;

  switch (status) {
    case "invited":
      backgroundColor = "bg-blue-50";
      textColor = "text-blue-500";
      label = "Đã gửi lời mời";
      break;
    case "responsed":
      backgroundColor = "bg-green-50";
      textColor = "text-green-500";
      label = "Đã phản hồi";
      break;
    case "pending":
      backgroundColor = "bg-orange-50";
      textColor = "text-orange-500";
      label = "Chờ xử lý";
      break;
    case "rejected":
      backgroundColor = "bg-red-50";
      textColor = "text-red-500";
      label = "Đã từ chối";
      break;
    case "progressing":
      backgroundColor = "bg-indigo-50";
      textColor = "text-indigo-500";
      label = "Đã từ chối";
      break;
    case "interviewed":
      backgroundColor = "bg-purple-50";
      textColor = "text-purple-500";
      label = "Đã phỏng vấn";
      break;
    case "canceled":
      backgroundColor = "bg-red-50";
      textColor = "text-red-500";
      label = "Đã huỷ";
      break;
    default:
      backgroundColor = "bg-gray-50";
      textColor = "text-gray-500";
      label = "Trạng thái không xác định";
  }

  return (
    <div
      className={`p-2 rounded-md text-[10px] ${backgroundColor} ${textColor} mx-2`}
    >
      {label}
    </div>
  );
};

export default JobStatusBadge;
