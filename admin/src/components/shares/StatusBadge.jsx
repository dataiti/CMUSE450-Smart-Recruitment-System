import React from "react";

const StatusBadge = ({ status }) => {
  let badgeClass, badgeText;

  switch (status) {
    case "pending":
      badgeClass = "bg-blue-50 text-blue-500";
      badgeText = "Chờ phê duyệt";
      break;
    case "active":
      badgeClass = "bg-green-50 text-green-500";
      badgeText = "Đang hoạt động";
      break;
    case "expired":
      badgeClass = "bg-yellow-50 text-yellow-500";
      badgeText = "Đã hết hạn";
      break;
    case "locked":
      badgeClass = "bg-red-50 text-red-500";
      badgeText = "Đã khoá";
      break;
    default:
      badgeClass = "bg-yellow-50 text-yellow-500";
      badgeText = "Bị từ chối";
  }

  return (
    <div className={`p-2 rounded-md text-[12px] ${badgeClass}`}>
      {badgeText}
    </div>
  );
};

export default StatusBadge;
