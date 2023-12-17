import { rootApi } from "../../../configs/rootApi";

const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListFollowings: builder.query({
      query: ({ userId }) => {
        return {
          url: `/user/get-followings/${userId}`,
          method: "GET",
        };
      },
    }),
    replacePassword: builder.mutation({
      query: ({ data, userId }) => {
        return {
          url: `/user/replace-password/${userId}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    toggleWishListItem: builder.mutation({
      query: ({ userId, jobId }) => ({
        url: `/user/toggle-wishlist-item/${userId}/${jobId}`,
        method: "PUT",
      }),
    }),
    userViewedJob: builder.mutation({
      query: ({ userId, jobId }) => ({
        url: `/user/user-viewed-jobs/${userId}/${jobId}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useReplacePasswordMutation,
  useToggleWishListItemMutation,
  useUserViewedJobMutation,
  useGetListFollowingsQuery,
} = userApi;
