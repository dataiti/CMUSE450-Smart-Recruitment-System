import { rootApi } from "../../../configs/rootApi";

const scheduleApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createWorkPositionRequired: builder.mutation({
      query: ({ data, userId, employerId }) => {
        return {
          url: `/workPositionRequired/create-work-position-required/${userId}/${employerId}`,
          method: "POST",
          body: data,
        };
      },
    }),
    getListSchedulesForEmployer: builder.query({
      query: ({ userId, employerId }) => {
        return {
          url: `/workPositionRequired/list-schedules/${userId}/${employerId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateWorkPositionRequiredMutation } = scheduleApi;
