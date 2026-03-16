import { apiSlice } from '../../app/api/apiSlice';
import { clearToken } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkExistingUser: builder.mutation({
      query: (email) => ({
        url: '/users/checkExistingUser',
        method: 'POST',
        body: {email},
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // could also use OnQueryStarted to set clear login form state here
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // data is expected to be the response from server { message: 'Logged out successfully' }
          console.log('in authApiSlice.logout onQueryStarted. data: ', data);
          dispatch(clearToken());
          // clear out cached data, subscriptions and anything to do with our api
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.error(
            'in authApiSlice logout onQueryStarted. Error logging out user: ',
            error,
          );
        }
      },
    }),
    // requests to this endpoint will already contain the access token in the header as set in app/api/apiSlice.js,
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
    }),
  }),
});

// these hooks are auto-generated based on the defined endpoints
// (if its a mutation endpoint, we use `use[EndpointName]Mutation`,
// if it's a query endpoint, we use `use[EndpointName]Query`)
export const { useCheckExistingUserMutation, useRegisterMutation, useLoginMutation, useLogoutMutation, useRefreshMutation } = authApiSlice;
