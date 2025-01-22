import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const statisticsEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  getDashboardStatistics: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DASHBOARD_STATISTICS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) => response.data,
  }),
  getAssetsStatistics: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.ASSETS_STATISTICS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) => response.data,
  }),
});
