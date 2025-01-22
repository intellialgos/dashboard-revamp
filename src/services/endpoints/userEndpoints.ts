import { ENDPOINTS } from "@/const/endpoints";
import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const userEndpoints = (builder: EndpointBuilder<any, any, any>) => ({
  getUsers: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.USERS_LIST,
      params
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
  getUser: builder.query({
    query: (params: any) => ({
      url: ENDPOINTS.GET_USER,
      params,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
  postUser: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.POST_USER,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
  deleteUser: builder.mutation({
    query: (body: any) => ({
      url: ENDPOINTS.DELETE_USER,
      method: "POST",
      body,
    }),
    transformResponse: (response: { data: any }, meta, arg) =>
      response.data,
  }),
});
