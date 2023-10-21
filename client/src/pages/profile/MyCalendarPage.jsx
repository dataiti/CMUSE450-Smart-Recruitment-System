import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "react-router-dom";

moment.locale("vi");

const localizer = momentLocalizer(moment);

function MyCalendarPage() {
  const minTime = new Date();
  minTime.setHours(7, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  const events = [
    {
      title:
        "Phòng 111 - Phỏng vấn ở công ty A - Vị trí lập trình viên Frontend ReactJS",
      start: new Date(2023, 9, 16, 8, 0),
      end: new Date(2023, 9, 16, 11, 0),
    },
    {
      title:
        "Phòng 345 - Phỏng vấn ở công ty A - Vị trí lập trình viên Backtend NodeJS",
      start: new Date(2023, 9, 17, 14, 0),
      end: new Date(2023, 9, 17, 19, 0),
    },
    {
      title: "Phòng 213 - Phỏng vấn ở công ty A - Phò",
      start: new Date(2023, 9, 19, 13, 0),
      end: new Date(2023, 9, 19, 16, 0),
    },
  ];

  const eventPropGetter = () => {
    const style = {
      backgroundColor: "#212f3f",
      color: "#0891b2",
    };

    return {
      style,
    };
  };

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
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 556, backgroundColor: "white" }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={(date) => ({
            style: {
              backgroundColor: moment(date).isSame(moment(), "day")
                ? "#ffedd5"
                : "white",
            },
          })}
          defaultView="week"
          min={minTime}
          max={maxTime}
        />
      </div>
    </div>
  );
}

export default MyCalendarPage;
