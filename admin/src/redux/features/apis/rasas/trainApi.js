import { rootApi } from "../../../../configs/rootApi";

const trainApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getDataTrain: builder.query({
      query: () => {
        return {
          url: "/rasa/data-train",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetDataTrainQuery } = trainApi;
