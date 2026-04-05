import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/authSlice'; 
import registerReducer from '../features/auth/register/registerSlice';
import loginReducer from '../features/auth/login/loginSlice';
import globalErrorReducer from '../features/globalError/globalErrorSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    globalError: globalErrorReducer,
    register: registerReducer,
    login: loginReducer,
  },
  // we need the below line when using RTK Query, otherwise we would need to add the apiSlice.middleware 
  // on every single component that needs to make an API call.  it is REQUIRED
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === 'development',
});

// this line allows us to use the options object in our query hooks 
// (ex: useFetchTodosQuery(arg, { pollingInterval: 60000 }))
setupListeners(store.dispatch);