import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const groupEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  postGroup: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.POST_GROUP,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
  deleteGroup: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DELETE_GROUP,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  })
});
