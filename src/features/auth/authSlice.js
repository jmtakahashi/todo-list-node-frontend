import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userId: null,
  persist: JSON.parse(localStorage.getItem('persist')) || false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setPersist: (state, action) => {
      state.persist = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.userId = null;
    },
  },
});

export const selectToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.userId;
export const selectAuthPersist = (state) => state.auth.persist;
export const selectAuthError = (state) => state.auth.error;

export const { setToken, setUserId, setAuthError, clearToken, setPersist } = authSlice.actions;

export default authSlice.reducer;
