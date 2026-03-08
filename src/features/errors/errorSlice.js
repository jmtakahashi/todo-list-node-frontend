import { createSlice } from '@reduxjs/toolkit';

const initialState = { error: null };

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload.error;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
