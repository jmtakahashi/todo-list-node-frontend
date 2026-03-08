import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setAuthError: (state, action) => {
      state.error = action.payload.error;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const getToken = (state) => state.auth.token;
export const getAuthError = (state) => state.auth.error;

export const { setToken, setAuthError, clearToken } = authSlice.actions;

export default authSlice.reducer;
