import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const eventsEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  queryEvents: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.EVENTS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
  processEvent: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.PROCESS_EVENT,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
  eventsFilters: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.GET_FILTERS,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
});
