import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  persist: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setPersist: (state, action) => {
      state.persist = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const getToken = (state) => state.auth.token;
export const getAuthPersist = (state) => state.auth.persist;
export const getAuthError = (state) => state.auth.error;

export const { setToken, setAuthError, clearToken, setPersist } = authSlice.actions;

export default authSlice.reducer;
