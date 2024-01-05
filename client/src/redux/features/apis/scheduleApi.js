import { rootApi } from "../../../configs/rootApi";

const scheduleApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createSchedule: builder.mutation({
      query: ({ data, userId, employerId }) => {
        return {
          url: `/schedule/create-schedule/${userId}/${employerId}`,
          method: "POST",
          body: data,
        };
      },
    }),
    getListSchedulesForUser: builder.query({
      query: ({ userId }) => {
        return {
          url: `/schedule/list-schedules/${userId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateScheduleMutation, useGetListSchedulesForUserQuery } =
  scheduleApi;
