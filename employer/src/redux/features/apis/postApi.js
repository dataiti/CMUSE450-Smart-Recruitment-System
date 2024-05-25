import { rootApi } from "../../../configs/rootApi";

const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobDetail: builder.query({
      query: ({ jobId }) => {
        return {
          url: `/job/get-job-detail/${jobId}`,
          method: "GET",
        };
      },
    }),
    getListPostForEmployer: builder.query({
      query: ({ employerId }) => {
        return {
          url: `/post/get-posts-for-employer/${employerId}`,
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
  }),
});

export const {
  useGetListPostForEmployerQuery,
  useGetPostsQuery,
  useCreatePostMutation,
} = postApi;
