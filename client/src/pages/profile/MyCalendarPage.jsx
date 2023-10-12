import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
      start: new Date(2023, 9, 11, 8, 0),
      end: new Date(2023, 9, 11, 11, 0),
    },
    {
      title:
        "Phòng 345 - Phỏng vấn ở công ty A - Vị trí lập trình viên Backtend NodeJS",
      start: new Date(2023, 9, 19, 14, 0),
      end: new Date(2023, 9, 19, 19, 0),
    },
    {
      title: "Phòng 213 - Phỏng vấn ở công ty A - Phò",
      start: new Date(2023, 9, 21, 13, 0),
      end: new Date(2023, 9, 21, 16, 0),
    },
  ];

  const eventPropGetter = () => {
    const style = {
      backgroundColor: "black",
      color: "white",
    };

    return {
      style,
    };
  };

  return (
    <div className="shadow-md p-4 bg-white rounded-md">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 608, backgroundColor: "white" }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={(date) => ({
          style: {
            backgroundColor: moment(date).isSame(moment(), "day")
              ? "#d1d5db"
              : "white",
          },
        })}
        defaultView="week"
        min={minTime}
        max={maxTime}
      />
    </div>
  );
}

export default MyCalendarPage;
