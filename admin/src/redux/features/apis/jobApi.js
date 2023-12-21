import { rootApi } from "../../../configs/rootApi";

const jobApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobDetail: builder.query({
      query: ({ userId, jobId }) => {
        return {
          url: `/job/get-job-detail/${userId}/${jobId}`,
          method: "GET",
        };
      },
    }),
    getListOfJobsForAdmin: builder.query({
      query: ({
        userId,
        search,
        sortBy,
        orderBy,
        page,
        limit,
        experience,
        status,
      }) => {
        return {
          url: `/job/list-jobs/admin/${userId}?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&experience=${experience}&status=${status}`,
          method: "GET",
        };
      },
    }),
    createJob: builder.mutation({
      query: ({ data, userId, employerId }) => {
        return {
          url: `/job/create-job/${userId}/${employerId}`,
          method: "POST",
          body: data,
        };
      },
    }),
    editJob: builder.mutation({
      query: ({ data, userId, jobId }) => {
        return {
          url: `/job/edit-job/${userId}/${jobId}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteJob: builder.mutation({
      query: ({ userId, employerId, jobId, addressId }) => {
        return {
          url: `/job/delete-job/${userId}/${employerId}/${jobId}/${addressId}`,
          method: "DELETE",
        };
      },
    }),
    toggleLockJob: builder.mutation({
      query: ({ userId, jobId }) => {
        return {
          url: `/job/toggle-lock-job/admin/${userId}/${jobId}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useGetListOfJobsForAdminQuery,
  useGetJobDetailQuery,
  useCreateJobMutation,
  useDeleteJobMutation,
  useEditJobMutation,
  useToggleLockJobMutation,
} = jobApi;
