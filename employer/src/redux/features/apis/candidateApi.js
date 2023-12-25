import { rootApi } from "../../../configs/rootApi";

const candidateApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    suggestedCandidates: builder.query({
      query: ({ userId, employerId }) => {
        return {
          url: `/candidate/get-suggested-candidates/${userId}/${employerId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useSuggestedCandidatesQuery } = candidateApi;
