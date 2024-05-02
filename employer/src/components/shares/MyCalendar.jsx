import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en");

const localizer = momentLocalizer(moment);

const MyCalendar = ({
  events = [],
  view = "month",
  isToolbar = true,
  height = 616,
}) => {
  const minTime = new Date();
  minTime.setHours(7, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(22, 0, 0);

  const eventPropGetter = (event) => {
    const style = {
      backgroundColor: event.status === "online" ? "#c0ffc0" : "#fff5af",
      color: "#000",
      border: `2px solid ${event.status === "online" ? "#10b981" : "#fdd88e"}`,
    };

    return {
      style,
    };
  };

  const handleEventClick = (event) => {};

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: height, backgroundColor: "white" }}
      eventPropGetter={eventPropGetter}
      dayPropGetter={(date) => ({
        style: {
          backgroundColor: moment(date).isSame(moment(), "day")
            ? "#f8f2de"
            : "white",
        },
      })}
      defaultView={view}
      min={minTime}
      max={maxTime}
      onSelectEvent={handleEventClick}
      components={{
        toolbar: isToolbar ? undefined : () => null,
      }}
    />
  );
};

export default MyCalendar;
