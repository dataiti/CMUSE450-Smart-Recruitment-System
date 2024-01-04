import { rootApi } from "../../../configs/rootApi";

const applyApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListApplyJobForEmployer: builder.query({
      query: ({
        userId,
        employerId,
        search = "",
        status,
        limit,
        page,
        orderBy,
        sortBy,
      }) => {
        return {
          url: `/applyJob/get-list-apply-jobs/${userId}/${employerId}?search=${search}&page=${page}&orderBy=${orderBy}&sortBy=${sortBy}&limit=${limit}&status=${status}`,
          method: "GET",
        };
      },
    }),
    getApplyJobDetail: builder.query({
      query: ({ userId, employerId, applyId }) => {
        return {
          url: `/applyJob/get-apply-job-detail/${userId}/${applyId}/${employerId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetListApplyJobForEmployerQuery, useGetApplyJobDetailQuery } =
  applyApi;
