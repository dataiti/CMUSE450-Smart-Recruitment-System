import { rootApi } from "../../../configs/rootApi";

const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostDetail: builder.query({
      query: ({ postId }) => {
        return {
          url: `/post/get-post-detail/${postId}`,
          method: "GET",
        };
      },
    }),
    getPosts: builder.query({
      query: ({ search, limit }) => {
        return {
          url: `/post/get-posts?search=${search}&limit=${limit}`,
          method: "GET",
        };
      },
    }),
    createPost: builder.mutation({
      query: ({ formData }) => {
        return {
          url: "/post/create-post",
          method: "POST",
          body: formData,
        };
      },
    }),
    updatePost: builder.mutation({
      query: ({ formData, postId }) => {
        return {
          url: `/post/update-post/${postId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    toggleLikePost: builder.mutation({
      query: ({ postId, data }) => {
        return {
          url: `/post/toggle-like-post/${postId}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deletePost: builder.mutation({
      query: ({ postId }) => {
        return {
          url: `/post/delete-post/${postId}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetPostDetailQuery,
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useToggleLikePostMutation,
  useDeletePostMutation,
} = postApi;
