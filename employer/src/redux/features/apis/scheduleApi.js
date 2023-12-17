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
    getListSchedulesForEmployer: builder.query({
      query: ({ userId, employerId }) => {
        return {
          url: `/schedule/list-schedules/${userId}/${employerId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useCreateScheduleMutation,
  useGetListSchedulesForEmployerQuery,
} = scheduleApi;
