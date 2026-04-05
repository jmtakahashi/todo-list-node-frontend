import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, clearToken } from '../../features/auth/authSlice';

// this file is located in app/ bcause it is used by multiple apiSlices.
// it sets up the base api configuration and tweaks it to utilize the jwt 
// access and refresh tokens/services for authentication.

// init our baseQuery with the base url and credentials included in every request
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// this is a wrapper around the baseQuery to handle token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // 1. try the original query
  let result = await baseQuery(args, api, extraOptions);

  // result is the response from the server at the endpoint specied in our slices
  // (ex: authApiSlice -> /auth/login, todoSlice -> /todo,  etc).

  // 2a. if we get a 403 error there was an issue with the access token
  // if (result.error && result.error.originalStatus === 403 ) {
  if (result.error && result.error.status === 403) {

    // 3. send refresh token to the server get a new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    // response will contain a data property containing the new access token or an error property (refreshResult.data || refreshResult.error)
    // 4a. if server responds with a new access token, store the token in state and retry the original query
    if (refreshResult?.data) {
      const newToken = refreshResult.data.accessToken;

      api.dispatch(setToken(newToken));

      result = await baseQuery(args, api, extraOptions);

      // 4b. if server responds with an error, clear the token from state and return the error
    } else {
      // 4b-1. if server responds with 403, set a message on the returned result
      if (refreshResult?.error?.status === 403) {
        // attach an error message to the result that will be returned to the component that initiated the original query
        refreshResult.error.data.message =
          'Your session has expired. Please log in again. ';
      }

      api.dispatch(clearToken());

      // return the error from the refresh attempt to error property of the hook that intiated the query
      // (ex: useGetTodosQuery -> error property of the hook will contain the error from the refresh attempt)
      // NOTE: the error property that will hold this result is scoped to the component that initiated the original query, 
      return refreshResult;
    }
  }

  // 2b. if you get a non-403 error, or if the original query succeeds, just return the result
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['List', 'Todo'],
  endpoints: (builder) => ({})
});