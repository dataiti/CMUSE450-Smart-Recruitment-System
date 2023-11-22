import { rootApi } from "../../../configs/rootApi";

const transactionApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: ({ data, userId, employerId }) => {
        return {
          url: `/transaction/create-payment/${userId}/${employerId}`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useCreatePaymentMutation } = transactionApi;
