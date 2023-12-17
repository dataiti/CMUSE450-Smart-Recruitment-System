import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { MyCalendar } from "../../components/shares";
import moment from "moment";

function MyCalendarPage() {
  const events = [
    {
      title: "Event 1",
      start: moment("2023-12-16T08:00:00").toDate(),
      end: moment("2023-12-16T11:00:00").toDate(),
      status: "online",
    },
    {
      title: "Event 2",
      start: moment("2023-12-14T14:00:00").toDate(),
      end: moment("2023-12-14T19:00:00").toDate(),
      status: "offline",
    },
    {
      title: "Event 3",
      start: moment("2023-12-12T13:00:00").toDate(),
      end: moment("2023-12-12T16:00:00").toDate(),
      status: "online",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <Breadcrumbs fullWidth className="!bg-white">
        <Link to="/" className="text-light-blue-500 text-sm font-bold">
          Trang chủ
        </Link>
        <Link to="/schedule-interview" className="font-bold text-sm">
          Lịch trình phỏng vấn
        </Link>
      </Breadcrumbs>
      <div className="max-h-[calc(100vh-156px)] p-4 bg-white rounded-md">
        <MyCalendar events={events} />
      </div>
    </div>
  );
}

export default MyCalendarPage;
