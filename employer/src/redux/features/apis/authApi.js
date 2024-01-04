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
    logOut: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/logout",
          method: "POST",
          body: { ...data },
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
  }),
});

export const {
  useLogInMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useLogOutMutation,
  useResetPasswordMutation,
} = authApi;
