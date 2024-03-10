import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@material-tailwind/react";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const minTime = new Date();
  minTime.setHours(7, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  const events = [
    {
      title:
        "Phòng 111 - Phỏng vấn ở công ty A - Vị trí lập trình viên Frontend ReactJS",
      start: new Date(2023, 8, 17, 8, 0),
      end: new Date(2023, 8, 17, 11, 0),
    },
    {
      title:
        "Phòng 345 - Phỏng vấn ở công ty A - Vị trí lập trình viên Backtend NodeJS",
      start: new Date(2023, 8, 19, 14, 0),
      end: new Date(2023, 8, 19, 19, 0),
    },
    {
      title: "Phòng 213 - Phỏng vấn ở công ty A - Phò",
      start: new Date(2023, 8, 21, 13, 0),
      end: new Date(2023, 8, 21, 16, 0),
    },
  ];

  const eventPropGetter = () => {
    const style = {
      backgroundColor: "bg-[#115e59]",
      color: "white",
    };

    return {
      style,
    };
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 330, backgroundColor: "white" }}
      eventPropGetter={eventPropGetter}
      dayPropGetter={(date) => ({
        style: {
          backgroundColor: moment(date).isSame(moment(), "day")
            ? "#d1d5db"
            : "white",
        },
      })}
      defaultView="month"
      min={minTime}
      max={maxTime}
      components={{
        toolbar: () => null,
      }}
    />
  );
};

const CustomToolbar = (toolbar) => {
  return (
    <div className=" flex items-center justify-center gap-2 pb-2">
      <Button
        variant="outlined"
        className="!px-4 !py-2"
        onClick={toolbar.onNavigate.bind(null, "TODAY")}
      >
        Hôm nay
      </Button>
      <Button
        variant="outlined"
        className="!px-4 !py-2"
        onClick={toolbar.onNavigate.bind(null, "PREV")}
      >
        Trước
      </Button>
      <Button
        variant="outlined"
        className="!px-4 !py-2"
        onClick={toolbar.onNavigate.bind(null, "NEXT")}
      >
        Tiếp theo
      </Button>
    </div>
  );
};

export default MyCalendar;
