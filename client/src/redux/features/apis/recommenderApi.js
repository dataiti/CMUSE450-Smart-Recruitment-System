import { rootApi } from "../../../configs/rootApi";

const recommenderApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommentJobForCandidate: builder.query({
      query: ({ userId }) => {
        return {
          url: `/recommender/recomment-jobs/${userId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetRecommentJobForCandidateQuery } = recommenderApi;
