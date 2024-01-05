import React, { useMemo } from "react";
import { Loading, MyCalendar } from "../../components/shares";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useGetListSchedulesForUserQuery } from "../../redux/features/apis/scheduleApi";
import { useSelector } from "react-redux";
import { authSelect } from "../../redux/features/slices/authSlice";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "react-router-dom";

function MyCalendarPage() {
  const { user } = useSelector(authSelect);

  const { data: listSchedulesData, isFetching } =
    useGetListSchedulesForUserQuery({
      userId: user?._id,
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
    <div className="w-full flex flex-col gap-2">
      {isFetching && <Loading />}
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
