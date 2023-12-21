import { rootApi } from "../../../configs/rootApi";

const employerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getListOfEmployerForAdmin: builder.query({
      query: ({ userId, search, sortBy, orderBy, page, limit, status }) => {
        return {
          url: `/employer/list-employers/admin/${userId}?search=${search}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}&status=${status}`,
          method: "GET",
        };
      },
    }),
    registerEmployerForAdmin: builder.mutation({
      query: ({ formData, userId }) => {
        return {
          url: `/employer/register-employer/admin/${userId}`,
          method: "POST",
          body: formData,
        };
      },
    }),
    editEmployer: builder.mutation({
      query: ({ data, userId, employerId }) => {
        return {
          url: `/employer/edit-employer/${userId}/${employerId}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteEmployer: builder.mutation({
      query: ({ userId, employerId, addressId }) => {
        return {
          url: `/employer/delete-employer/${userId}/${employerId}/${addressId}`,
          method: "DELETE",
        };
      },
    }),
    toggleLockEmployer: builder.mutation({
      query: ({ userId, employerId }) => {
        return {
          url: `/employer/toggle-lock-employer/admin/${userId}/${employerId}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useGetListOfEmployerForAdminQuery,
  useRegisterEmployerForAdminMutation,
  useDeleteEmployerMutation,
  useEditEmployerMutation,
  useToggleLockEmployerMutation,
} = employerApi;
