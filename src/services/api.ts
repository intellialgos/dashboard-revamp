import { createApi, fetchBaseQuery, } from "@reduxjs/toolkit/query/react";
import qs from "query-string";

import { API_BASE_URL, QUERY_STRING_ARRAY_FORMAT } from "../const/common";
// import {
//   DeviceEvent,
//   ReqDeviceEvent,
//   ReqQueryBySite,
// } from "../types/device-event";
// import { ProcessEvent, ReqProcessEvent } from "../types/process-event";
import {
  authEndpoints,
  groupEndpoints,
  orgEndpoints,
  statisticsEndpoints,
  uploadEndpoints,
  userEndpoints
} from "@/services/endpoints";
import { DeviceEvent, ReqDeviceEvent, ReqQueryBySite } from "@/types/device-event";
import { ProcessEvent, ReqProcessEvent } from "@/types/process-event";
import { RootState } from "@/types/store";
import { setUserCredentials } from "@/store/slices/authSlice";
import { ENDPOINTS } from "@/const/endpoints";
import { eventsEndpoints } from "./endpoints/eventsEndpoints";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, {getState}) => {
    const state = getState() as RootState;
    const token = state.authState.token;
    if ( token ) {
      headers.set('Authorization', token);
    }
    return headers;
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: QUERY_STRING_ARRAY_FORMAT,
      skipEmptyString: true,
      skipNull: true,
    }),
});

const baseQueryWithRefreshToken = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error && result?.error?.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      {
        url: ENDPOINTS.REFRESH_TOKEN, // Adjust the refresh token endpoint as per your API
        method: "POST",
        body: { token: (api.getState() as RootState).authState.token }, // Use refresh token from state
      },
      api,
      extraOptions
    );

    console.log("REFRESH RES: ", refreshResult);
    if (refreshResult?.data) {
      const newToken = refreshResult.data.token;
      // Update the token in the store
      api.dispatch(setUserCredentials({ token: newToken }));
      // Retry the original query with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Handle failed token refresh (e.g., logout the user)
      console.log("SHOULD LOGOUT");
      api.dispatch({ type: "auth/logout" }); // Replace with your logout action
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: [],
  baseQuery: baseQueryWithRefreshToken,
  endpoints: (builder) => ({
    ...authEndpoints(builder),
    ...userEndpoints(builder),
    ...orgEndpoints(builder),
    ...groupEndpoints(builder),
    ...eventsEndpoints(builder),
    ...statisticsEndpoints(builder),
    ...uploadEndpoints(builder),
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
  // AUTH
    useLoginMutation,
    useRefreshTokenMutation,
  // USERS
    useGetUsersQuery,
    useGetUserQuery,
    usePostUserMutation,
    useDeleteUserMutation,
  // ORGANIZAIONS
    useGetOrganizationsMutation,
    usePostOrganizationMutation,
  // GROUPS
    usePostGroupMutation,
    useDeleteGroupMutation,
  // SITES
    useGetSitesQuery,
    useCreateSiteMutation,
    useDeleteSiteMutation,
    useRestartBoxMutation,
    useUpdateIoEventsMutation,
    useGetMaskedItemMutation,
    useGetBoxStatusMutation,
    useGetIoEventsMutation,
    useUpgradeBoxMutation,
    useDeleteMaskedItemMutation,
  // UPLOAD
    useUploadMutation,
    useGetUploadsQuery,
    useDeleteUploadMutation,
  // STATISTICS
    useGetDashboardStatisticsMutation,
    useGetAssetsStatisticsMutation,
  // EVENTS
    useQueryEventsMutation,
    useProcessEventMutation,
  // OTHERS
    useQueryeventsiteMutation,
    useGetFastRecoveryMutation,
    useMaskItemMutation,
    useConfigureBoxMutation,
    useEventsFiltersMutation
} = api;