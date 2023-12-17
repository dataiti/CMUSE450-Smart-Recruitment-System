import React, { useMemo } from "react";
import moment from "moment";
import { Loading, MyCalendar } from "../../components/shares";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Typography } from "@material-tailwind/react";
import { useGetListSchedulesForEmployerQuery } from "../../redux/features/apis/scheduleApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { covertToDate, timeAgo } from "../../utils/fn";

const MyCalendarPage = () => {
  const { user } = useSelector(authSelect);

  const { data: listSchedulesData, isFetching } =
    useGetListSchedulesForEmployerQuery({
      userId: user?._id,
      employerId: user?.ownerEmployerId?._id,
    });

  const events = useMemo(() => {
    if (!listSchedulesData || !listSchedulesData.data) {
      return [];
    }

    return listSchedulesData?.data.map((schedule) => ({
      title: `${schedule.title} - ${schedule.location}`,
      start: new Date(schedule.start),
      end: new Date(schedule.end),
      status: schedule.status,
    }));
  }, [listSchedulesData]);

  return (
    <div className="w-full flex">
      {isFetching && <Loading />}
      <div className="px-5 flex items-center justify-center w-[68%]">
        <div className="max-h-[calc(100vh - 70px)] w-full p-4 bg-white rounded-md">
          <MyCalendar events={events} view="week" isToolbar />
        </div>
      </div>
      <div className="w-[32%] bg-white h-[calc(100vh-60px)] p-5">
        <Typography className="uppercase font-bold text-blue-500 text-lg my-2">
          Danh sách lịch
        </Typography>
        <div className="flex flex-col gap-2">
          {events.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  item.status === "online"
                    ? "bg-[#c0ffc0] border-[#10b981]"
                    : "bg-[#fff5af] border-[#fdd88e]"
                } px-5 py-4 rounded-md border-l-4 `}
              >
                <Typography className="text-lg font-extrabold">{`${covertToDate(
                  item.start
                )} (${timeAgo(item.start)}): `}</Typography>
                <Typography className="font-bold text-sm">
                  {item.title}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyCalendarPage;
