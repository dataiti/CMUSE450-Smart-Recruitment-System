import { rootApi } from "../../../configs/rootApi";

const jobApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobDetail: builder.query({
      query: ({ jobId }) => {
        return {
          url: `/job/get-job-detail/${jobId}`,
          method: "GET",
        };
      },
    }),
    getListOfJobsForEmployer: builder.query({
      query: ({
        userId,
        employerId,
        search,
        sortBy,
        orderBy,
        page,
        limit,
        experience,
        status,
      }) => {
        return {
          url: `/job/get-list-jobs/employer/${userId}/${employerId}?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&experience=${experience}&status=${status}`,
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
      query: ({ data, userId, employerId, jobId, addressId }) => {
        return {
          url: `/job/edit-job/${userId}/${employerId}/${jobId}/${addressId}`,
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
    toggleHiringStatusJob: builder.mutation({
      query: ({ userId, employerId, jobId }) => {
        return {
          url: `/job/toggle-hiring-satus/${userId}/${employerId}/${jobId}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useGetListOfJobsForEmployerQuery,
  useGetJobDetailQuery,
  useCreateJobMutation,
  useDeleteJobMutation,
  useEditJobMutation,
  useToggleHiringStatusJobMutation,
} = jobApi;
