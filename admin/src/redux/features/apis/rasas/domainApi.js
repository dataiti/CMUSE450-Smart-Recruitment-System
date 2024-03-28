import { rootApi } from "../../../../configs/rootApi";

const domainApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    readDomainData: builder.query({
      query: () => {
        return {
          url: "/rasa/domain/get-domain-data",
          method: "GET",
        };
      },
    }),
    writeDomainData: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/domain/write-domain-data",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useReadDomainDataQuery, useWriteDomainDataMutation } = domainApi;
