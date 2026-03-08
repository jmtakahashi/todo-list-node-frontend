import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, clearToken } from '../../features/auth/authSlice';

// this file is located in app bcause it is used by multiple features and sets up our
// base api configuration to utilize our jwt access and refresh tokens for authentication.
// it is more of a "service" that can be used by any feature that needs to make an API call'

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

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log('running apiSlice.baseQueryWithReauth...')
  let result = await baseQuery(args, api, extraOptions);

  console.log('in apiSlice. result: ', result);
  
  // if (result.error && result.error.originalStatus === 403 ) {
  if (result.error && result.error.status === 403 ) {
    console.log('in apiSlice.baseQueryWithReauth.  sending refresh token...');
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    console.log('in apiSlice.baseQueryWithReauth refreshResult: ', refreshResult);
    if (refreshResult.data) {
      const newToken = refreshResult.data.accessToken;
      // store new token
      api.dispatch(setToken({ token: newToken }));
      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearToken());
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Todo'],
  endpoints: (builder) => ({})
});