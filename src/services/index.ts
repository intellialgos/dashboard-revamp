import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "query-string";

import { API_BASE_URL, QUERY_STRING_ARRAY_FORMAT } from "../const/common";
import {
  DeviceEvent,
  ReqDeviceEvent,
  ReqQueryBySite,
} from "../types/device-event";
import { ProcessEvent, ReqProcessEvent } from "../types/process-event";

export const api = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://f50048686d07.ngrok.app/",
    paramsSerializer: (params) =>
      qs.stringify(params, {
        arrayFormat: QUERY_STRING_ARRAY_FORMAT,
        skipEmptyString: true,
        skipNull: true,
      }),
  }),
  endpoints: (builder) => ({
    getAllEvents: builder.mutation({
      query: (body: ReqDeviceEvent) => ({
        url: "query-events",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: DeviceEvent }, meta, arg) =>
        response.data,
    }),
    processEvent: builder.mutation({
      query: (body: ReqProcessEvent) => ({
        url: "process-events",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: ProcessEvent }, meta, arg) =>
        response.data,
    }),
    queryeventsite: builder.mutation({
      query: (body: ReqQueryBySite) => ({
        url: "query-events-countby-by-site",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }, meta, arg) => response.data,
    }),
  }),
});

export const {
  useGetAllEventsMutation,
  useProcessEventMutation,
  useQueryeventsiteMutation,
} = api;
