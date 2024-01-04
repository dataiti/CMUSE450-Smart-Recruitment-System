import { rootApi } from "../../../configs/rootApi";

const candidateApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidateDetail: builder.query({
      query: ({ userId, candidateId }) => {
        return {
          url: `/candidate/get-user-detail/${userId}/${candidateId}`,
          method: "GET",
        };
      },
    }),
    createCandidate: builder.mutation({
      query: ({ data, userId }) => {
        return {
          url: `/candidate/register-candidate/${userId}`,
          method: "POST",
          body: data,
        };
      },
    }),
    editCandidate: builder.mutation({
      query: ({ data, userId, candidateId }) => {
        return {
          url: `/candidate/edit-candidate/${userId}/${candidateId}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteCandidate: builder.mutation({
      query: ({ userId, candidateId }) => {
        return {
          url: `/candidate/delete-candidate/${userId}/${candidateId}`,
          method: "DELETE",
        };
      },
    }),
    toggleApplyAuto: builder.mutation({
      query: ({ userId, candidateId }) => {
        return {
          url: `/candidate/toggle-apply-auto/${userId}/${candidateId}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useCreateCandidateMutation,
  useGetCandidateDetailQuery,
  useDeleteCandidateMutation,
  useEditCandidateMutation,
  useToggleApplyAutoMutation,
} = candidateApi;
