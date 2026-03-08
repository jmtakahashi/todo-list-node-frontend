import { createSlice } from '@reduxjs/toolkit';

// this is our global error state

const initialState = {
  error: null
};

const globalErrorSlice = createSlice({
  name: 'globalError',
  initialState,
  reducers: {
    setGlobalError: (state, action) => {
      state.error = action.payload;
    },
    clearGlobalError: (state) => {
      state.error = null;
    },
  },
});

export const getGlobalError = (state) => state.globalError.error;
export const { setGlobalError, clearGlobalError } = globalErrorSlice.actions;
export default globalErrorSlice.reducer;
