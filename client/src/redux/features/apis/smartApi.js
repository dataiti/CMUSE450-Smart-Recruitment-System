import { rootApi } from "../../../configs/rootApi";

const candidateApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvaluateSuitableJob: builder.query({
      query: ({ userId, candidateId, jobId }) => {
        return {
          url: `/smart/evaluate-suitable-job/${userId}/${candidateId}/${jobId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetEvaluateSuitableJobQuery } = candidateApi;
