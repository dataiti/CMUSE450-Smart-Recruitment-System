import { rootApi } from "../../../configs/rootApi";

const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...data },
      }),
    }),
    logIn: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...data },
      }),
    }),
    sociallogIn: builder.mutation({
      query: (data) => ({
        url: "/auth/social-login",
        method: "POST",
        body: { ...data },
      }),
    }),
    logOut: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/logout",
          method: "POST",
          body: { ...data },
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
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { ...data },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { ...data },
      }),
    }),
    toggleWishListItem: builder.mutation({
      query: ({ userId, jobId }) => ({
        url: `/user/toggle-wishlist-item/${userId}/${jobId}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useLogInMutation,
  useSociallogInMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useLogOutMutation,
  useResetPasswordMutation,
  useReplacePasswordMutation,
  useToggleWishListItemMutation,
} = authApi;
