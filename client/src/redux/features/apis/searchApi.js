import { rootApi } from "../../../configs/rootApi";

const searchApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    saveSearch: builder.mutation({
      query: ({ userId, keyword }) => {
        return {
          url: `/search/save-search/${userId}`,
          method: "POST",
          body: { keyword },
        };
      },
    }),
    deleteSearch: builder.mutation({
      query: ({ userId, searchId }) => {
        return {
          url: `/search/delete-search/${userId}/${searchId}`,
          method: "DELETE",
        };
      },
    }),
    getListJobsByKeywordForUser: builder.query({
      query: ({ userId, keyword, limit }) => {
        return {
          url: `/search/get-list-jobs/keyword/${userId}?keyword=${keyword}&limit=${limit}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetListJobsByKeywordForUserQuery,
  useDeleteSearchMutation,
  useSaveSearchMutation,
} = searchApi;
