import { rootApi } from "../../../configs/rootApi";

const commentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getPostDetail: builder.query({
      query: ({ postId }) => {
        return {
          url: `/post/get-post-detail/${postId}`,
          method: "GET",
        };
      },
    }),
    getCommentsByPost: builder.query({
      query: ({ search, limit }) => {
        return {
          url: `/post/get-comments-by-post`,
          method: "GET",
        };
      },
    }),
    createComment: builder.mutation({
      query: ({ formData }) => {
        return {
          url: "/comment/create-post",
          method: "POST",
          body: formData,
        };
      },
    }),
    replyToComment: builder.mutation({
      query: ({ formData, postId }) => {
        return {
          url: `/comment/update-post/${postId}`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    deleteComment: builder.mutation({
      query: ({ postId }) => {
        return {
          url: `/comment/delete-post/${postId}`,
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
} = commentApi;
