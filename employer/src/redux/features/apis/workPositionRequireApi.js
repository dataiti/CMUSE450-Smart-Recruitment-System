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
    deleteWorkPositionRequiredbuilder: builder.mutation({
      query: ({ userId, employerId, workPositionRequiredId }) => {
        return {
          url: `/workPositionRequired/delete-work-position-required/${userId}/${employerId}/${workPositionRequiredId}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useCreateWorkPositionRequiredMutation,
  useDeleteWorkPositionRequiredbuilderMutation,
} = scheduleApi;
